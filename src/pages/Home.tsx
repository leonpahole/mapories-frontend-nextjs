import React, { memo } from "react";
import { Button, Icon } from "rsuite";
import styled from "styled-components";
import { Breakpoints } from "../constants/breakpoints";
import { Link } from "react-router-dom";

const MainContainer = styled.div`
  padding-top: 50px;
  display: flex;

  @media (max-width: ${Breakpoints.tablet}) {
    padding-top: 20px;
    flex-direction: column-reverse;
  }
`;

const OuterTextContainer = styled.div`
  padding-left: 60px;
  padding-right: 60px;
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;

  @media (max-width: ${Breakpoints.tablet}) {
    padding-left: unset;
    padding-right: unset;
  }
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;

  @media (max-width: ${Breakpoints.tablet}) {
    padding-bottom: 30px;
  }
`;

const Image = styled.img`
  max-width: 450px;
  width: 100%;
`;

const IconContainer = styled.div`
  display: flex;
  margin-right: 10px;
`;

const FeatureContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ButtonsContainer = styled.div`
  display: flex;

  @media (max-width: ${Breakpoints.mobile}) {
    justify-content: center;
  }
`;

const features = [
  {
    icon: "map",
    text: "Mark your travels on a map",
  },
  {
    icon: "camera-retro",
    text: "Take pictures and videos",
  },
  {
    icon: "group",
    text: "Share experiences with your friends and chat",
  },
];

const Home: React.FC = memo(() => {
  return (
    <MainContainer>
      <OuterTextContainer>
        <TextContainer>
          <div>
            <h1 className="title">Put your memories on a map.</h1>
            <p className="subtitle">
              Mapories is a <b>social network for travellers</b>.
            </p>
            <div className="mt-4 mb-4">
              {features.map((f) => (
                <p className="mt-2 subsubtitle">
                  <FeatureContainer>
                    <IconContainer>
                      <Icon icon={f.icon as any} size="lg" />
                    </IconContainer>
                    {f.text}
                  </FeatureContainer>
                </p>
              ))}
            </div>
          </div>

          <ButtonsContainer>
            <Button
              appearance="primary"
              className="mr-2"
              size="lg"
              componentClass={Link}
              to="/register"
            >
              Create an account
            </Button>
            <Button
              appearance="ghost"
              className="ml-2"
              size="lg"
              componentClass={Link}
              to="/login"
            >
              Sign in
            </Button>
          </ButtonsContainer>
        </TextContainer>
      </OuterTextContainer>
      <ImageContainer>
        <Image src="images/map.png" />
      </ImageContainer>
    </MainContainer>
  );
});

export default Home;
