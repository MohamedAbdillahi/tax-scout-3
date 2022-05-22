import styled from "styled-components";

const AuthorDetailsContainer = styled.div`
  width: 100%;
  min-height: 6em;
  display: flex;
  border-bottom: 2px solid #d8d8d852;
  padding: 6px 8px;
  align-items: center;
`;

const Thumbnail = styled.div`
  width: auto;
  height: 100%;
  display: flex;
  flex: 0.4;

  img {
    width: auto;
    height: 100%;
  }
`;

const Name = styled.h3`
  font-size: 15px;
  color: #000;
  margin-left: 10px;

`;
export function Author(props) {
  const { image, name} = props;

  return (
    <AuthorDetailsContainer>
      <Name>{name}</Name>
      <Thumbnail>
        <img src={image || "N/A"} alt="" />
      </Thumbnail>
    </AuthorDetailsContainer>
  );
}
