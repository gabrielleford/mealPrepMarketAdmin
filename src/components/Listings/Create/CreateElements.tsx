import styled from 'styled-components';

export const ImageUploadDiv = styled.div`
  display: flex;
  justify-content: space-evenly;
`

export const ImageUpload = styled.label`
  cursor: pointer;
  display: block;
  margin: 0 auto;
  width: fit-content;
  padding: 5px 7px;
  font-size: 0.8rem;
  border-radius: 10px;
  color: #05386b;
  background: #5cdb95;
  box-shadow: 0 0 2px 1px rgba(92, 219, 149, 0.4);
  transition: all 0.3s ease-in-out;

  &:hover {
    background: #8ee4af;
    box-shadow: 0 0 2px 1px rgba(92, 219, 149, 0.4);
  }
`

export const ImageInput = styled.input`
  display: none;
`