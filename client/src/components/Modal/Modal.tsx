import { useState, useContext } from 'react';
import { Button, InputGroup, Modal, FormControl } from 'react-bootstrap';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context';

interface ModalProps {
  text: string;
  variant: string;
  isSignUpFlow: boolean;
}

const ErrorMessage = styled.p`
  color: red;
`;

const ModalComponent = ({ text, variant, isSignUpFlow }: ModalProps) => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [state, setState] = useContext(UserContext);

  const navigate = useNavigate();

  const handleClick = async () => {
    let data;
    if (isSignUpFlow) {
      const { data: signUpData } = await axios.post(
        'http://localhost:8080/auth/signup',
        {
          email,
          password,
        }
      );
      data = signUpData;
    } else {
      const { data: loginData } = await axios.post(
        'http://localhost:8080/auth/login',
        {
          email,
          password,
        }
      );
      data = loginData;
    }
    if (data.errors.length) {
      return setErrorMsg(data.errors[0].msg);
    }

    setState({
      data: {
        id: data.data.user.id,
        email: data.data.user.email,
        customerStripeId: data.data.user.customerStripeId,
      },
      loading: false,
      error: null,
    });

    localStorage.setItem('token', data.data.token);
    axios.defaults.headers.common[
      'authorization'
    ] = `Bearer ${data.data.token}`;
    navigate('/articles');
  };
  return (
    <>
      <Button variant={variant} onClick={handleShow} size='lg' className='m-2'>
        {text}
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{text}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className='mb-3'>
            <InputGroup.Text>Email</InputGroup.Text>
            <FormControl
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </InputGroup>
          <InputGroup className='mb-3'>
            <InputGroup.Text>Password</InputGroup.Text>
            <FormControl
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </InputGroup>
          {errorMsg && <ErrorMessage>{errorMsg}</ErrorMessage>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Close
          </Button>
          <Button variant='primary' onClick={handleClick}>
            {text}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalComponent;
