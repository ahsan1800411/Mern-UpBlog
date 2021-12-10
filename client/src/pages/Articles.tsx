import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import styled from 'styled-components';

const CardsContainer = styled.div`
  padding: 4rem 0;
  display: flex;
`;

const Card = styled.div`
  height: 50rem;
  width: 32%;
  box-shadow: 0.1rem 0.1rem 1rem rgba(0, 0, 0, 0.2);
  padding: 2rem;
  border-radius: 2rem;
  margin-right: 2rem;
`;

const Image = styled.img`
  width: 100%;
  height: 30rem;
  border-radius: 2rem;
`;

const Header = styled.h2`
  margin-top: 1rem;
  font-size: 2.5rem;
`;
const Content = styled.p`
  margin-top: 1rem;
  font-size: 1rem;
`;

const Articles = () => {
  const [articles, setArticles] = useState<any[]>([]);
  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    const { data } = await axios('http://localhost:8080/articles');
    setArticles(data);
  };

  const handleBuyPlan = () => {
    window.location.href = '/article-plan';
  };

  return (
    <Container>
      {articles.length ? (
        <CardsContainer>
          {articles.map((article) => (
            <Card key={article._id}>
              <Image src={article.imageUrl} />
              <Header>{article.title}</Header>
              <Content>{article.content}</Content>
            </Card>
          ))}
        </CardsContainer>
      ) : (
        <>
          <div>You don't have any plan</div>
          <Button
            onClick={handleBuyPlan}
            className='mt-3'
            variant='success'
            size='lg'
          >
            Buy a Plan
          </Button>
        </>
      )}
    </Container>
  );
};

export default Articles;
