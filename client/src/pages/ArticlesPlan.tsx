import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, Card, Container } from 'react-bootstrap';
import styled from 'styled-components';

const CardsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 75vh;
`;
const CardHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30rem;
  background-color: blue;
`;
const PriceCircle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 12.5rem;
  width: 12.5rem;
  border: 0.5rem solid white;
  border-radius: 50%;
  box-shadow: 0.1rem 0.1rem 1rem rgba(19, 20, 19, 0.342);
`;

const PriceText = styled.p`
  font-size: 3rem;
  text-shadow: 0.1rem 0.1rem 1rem rgba(19, 20, 19, 0.342);
  color: white;
`;

const ArticlesPlan = () => {
  const [prices, setPrices] = useState<any[]>([]);
  useEffect(() => {
    fetchPrices();
  }, []);
  const fetchPrices = async () => {
    const { data } = await axios.get('http://localhost:8080/subs/prices');
    setPrices(data.data);
  };

  const createSession = async (priceId: string) => {
    const { data } = await axios.post('http://localhost:8080/subs/session', {
      priceId,
    });
    window.location.href = data.url;
  };

  const backgroundColors: any = {
    Basic: 'green',
    Standard: 'blue',
    Premium: 'tomato',
  };

  return (
    <Container>
      <CardsContainer>
        {prices.map((price: any) => (
          <Card
            style={{ width: '18rem', height: '25rem', marginRight: '2rem' }}
          >
            <CardHeader
              style={{ backgroundColor: backgroundColors[price.nickname] }}
            >
              <PriceCircle>
                <PriceText>${price.unit_amount / 100}</PriceText>
              </PriceCircle>
            </CardHeader>
            <Card.Body>
              <Card.Title style={{ fontSize: '2rem' }}>
                {price.nickname}
              </Card.Title>
              <Button
                variant='primary'
                className='mt-3'
                onClick={() => createSession(price.id)}
              >
                Buy now
              </Button>
            </Card.Body>
          </Card>
        ))}
      </CardsContainer>
    </Container>
  );
};

export default ArticlesPlan;
