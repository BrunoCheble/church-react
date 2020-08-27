import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  height: 100vh;

  > header {
    height: 144px;
    background-color: #aa4545;
    display: flex;
    align-items: center;

    div {
      width: 100%;
      max-width: 1120px;
      margin: 0 auto;
      display: flex;
      align-items: center;

      h1 {
        text-align: left;
        color: #e8e8e8;
      }
      a {
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

export const Row = styled.div`
  display: flex;
  flex-direction: row;

  > div {
    width: 100%;
    position: relative;
    & + div {
      margin-left: 10px;
    }
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  place-content: center;

  margin-top: -176px;
  width: 100%;

  form {
    margin: 176px 0 20px;
    width: 100%;
    max-width: 1120px;
    text-align: center;
    display: flex;
    flex-direction: column;

    a {
      color: #f4ede8;
      display: block;
      margin-top: 24px;
      text-decoration: none;
      transition: color 0.2s;
      &:hover {
        color: ${shade(0.2, '#f4ede8')};
      }
    }
  }
`;

export const ContentForm = styled.div`
  border-radius: 4px;
  padding: 1em;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
  transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  background-color: #fff;

  margin-top: -30px;

  div + & {
    margin-top: 0;
  }

  .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
    border-color: #514f4c;
  }

  .MuiFormLabel-root.Mui-focused {
    color: #ff9000;
  }

  .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: #ff9000;
  }
`;

export const AvatarInput = styled.div`
  margin-bottom: 32px;
  margin-top: -96px;
  position: relative;
  align-self: center;

  img {
    width: 186px;
    height: 186px;
    border-radius: 50%;
    object-fit: cover;
  }

  > label {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 0;
    background: #ff9000;
    position: absolute;
    right: 0px;
    bottom: 0;
    transition: background-color 0.2s;

    display: flex;
    justify-content: center;
    align-items: center;
    svg {
      width: 20px;
      height: 20px;
      color: #312e38;
    }

    input {
      display: none;
    }

    &:hover {
      background: ${shade(0.2, '#ff9000')};
    }
  }
`;
