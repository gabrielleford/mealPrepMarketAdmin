import styled from "styled-components";

export const Banner = styled.div`
  position: relative;
  left: calc(-50vw + 50%);
  margin-top: 0;
  width: 100vw;
  padding: 0.5rem 0 1.4rem 0;
  background: #05386b;
  color: #edf5e1;
  text-align: center;

  @media screen and (max-width: 1407px) and (min-width: 1216px) {
    margin-top: 5rem;
  }

  @media screen and (max-width: 1215px) and (min-width: 1033px) {
    margin-top: 6.5rem;
  }

  @media screen and (max-width: 1032px) and (min-width: 769px) {
    margin-top: 5rem;
  }
`

export const BannerH1 = styled.h1`
  font-weight: 400;
  transition: 0.2s ease-in-out;

  @media screen and (max-width: 480px) {
    font-size: 1.5rem;
  }
`