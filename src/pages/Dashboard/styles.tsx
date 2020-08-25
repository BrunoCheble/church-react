import styled from 'styled-components';

export const Container = styled.div`
  height: 100vh;

  > header {
    height: 144px;
    background-color: #45aaa6;
    display: flex;
    align-items: center;

    div {
      width: 100%;
      max-width: 1120px;
      margin: 0 auto;
      display: flex;

      button {
        background: transparent;
        border: none;
        margin-left: auto;
      }

      svg {
        color: #ff9000;
        width: 24px;
        height: 24px;
      }
    }
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  place-content: center;
  width: 100%;
  max-width: 1120px;
  margin: -30px auto 0;

  > div {
    width: 100%;
  }
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;

  > div {
    width: 100%;
    & + div {
      margin-left: 10px;
    }
  }
`;

export const DetailMember = styled.div`
  padding: 15px;
  > div {
    line-height: 2em;
  }
`;
