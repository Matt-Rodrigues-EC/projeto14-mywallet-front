import axios from "axios";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import styled from "styled-components";
import { BiExit, BiX } from "react-icons/bi";
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {

  const Navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [operations, setOperation] = useState([]);
  const [total, setTotal] = useState(0);
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/home`, 
      {
        headers: {
          'Authorization': `Baerer ${token}` 
        }
      }
    )
      .then((response) => {
        const list = response.data.list;
        setUser(response.data.username)
        setOperation(list.reverse());
        let sum = 0;
        for (let i = 0; i < list.length; i++) {
          if(list[i].type === "entrada"){
            sum += Number(list[i].value);
          }
          if(list[i].type === "saida"){
            sum -= Number(list[i].value);
          }
        }
        // console.log(sum)
        setTotal(sum);
        return;
      })
      .catch((error) => {
        // eslint-disable-next-line eqeqeq
        if(error == "AxiosError: Request failed with status code 401"){
          alert("Não autorizado.");
          Navigate("/");
        }
        setLoading(false);
      })
  }, [Navigate, token, operations])

  function logOut(){
    localStorage.removeItem("token");
    alert("Sessão encerrada.")
    Navigate("/");
  }

  function deleteOperation(op){
    const id = op._id;
    confirmAlert({
      title: 'Confirmar exclusão',
      message: `Deseja excluir essa ${op.type}`,
      buttons: [
          {   label: 'Excluir',
              onClick: () => {
                axios.get(`${process.env.REACT_APP_API_URL}/home/${id}`,
                {
                  headers: {
                    'Authorization': `Baerer ${token}`,
                    'ID': `${id}`
                  }}
                )
                  .then((response) => {
                    // console.log(response);
                    alert(response.data);
                    // alert(`${op.type} excluída`)
                  })
                  .catch((error) => {
                    alert(error.message)
                  })
              }
          },
          {
              label: 'Cancelar',
              onClick: () => {alert("operação cancelada")}
          }
      ]
      });
  }

  return (
    <HomeContainer>
      <Header>
        <h1>Olá, {user}</h1>
        <BiExit onClick={() => logOut()} />
      </Header>

      <TransactionsContainer>
        {(operations.length === 0) ? (
          <>
            <WithouthInfo>Não há registros de<br/>entrada ou saída</WithouthInfo>
          </>
        ) : (
          <>
            <UL>
              {operations.map((op) => {
                return(
                  <ListItemContainer key={op._id}>
                    <Info>
                      <span>{op.date}</span>
                      <strong>{op.description}</strong>
                    </Info>
                    <Delete>
                      <Value color={(op.type === "entrada")? "positivo" : "negativo"}>
                        {(Number(op.value)).toFixed(2)}
                      </Value>
                      <BiX onClick={() => deleteOperation(op)} />
                    </Delete>
                  </ListItemContainer>
                )
              })}
            </UL>

            <article>
              <strong>Saldo</strong>
              <Value color={(total >= 0) ? "positivo" : "negativo" }>
                {(Number(total)).toFixed(2)}
              </Value>
            </article>
          </>
        )}
        
      </TransactionsContainer>


      <ButtonsContainer>
        <button disabled={loading} onClick={() => {setLoading(true); Navigate("/nova-transacao/entrada")}}>
          <AiOutlinePlusCircle />
          <p>Nova <br /> entrada</p>
        </button>
        <button disabled={loading} onClick={() => {setLoading(true); Navigate("/nova-transacao/saida")}}>
          <AiOutlineMinusCircle />
          <p>Nova <br />saída</p>
        </button>
      </ButtonsContainer>

    </HomeContainer>
  )
}

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 50px);
`
const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2px 5px 2px;
  margin-bottom: 15px;
  font-size: 26px;
  color: white;
`
const TransactionsContainer = styled.article`
  flex-grow: 1;
  background-color: #fff;
  color: #000;
  border-radius: 5px;
  padding: 16px;
  height: 70%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  article {
    display: flex;
    height: 20px;
    align-items: end;
    background-color: #fff;
    justify-content: space-between;   
    strong {
      font-weight: 700;
      text-transform: uppercase;
    }
  }
`
const UL = styled.ul`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  overflow-y: scroll;
  box-sizing: border-box;
  overflow-wrap: break-word;
  height: 95%;
  width: 100%;
`
const Info = styled.div`
  max-width: 75%;
  overflow-wrap: break-word;
`
const ButtonsContainer = styled.section`
  margin-top: 15px;
  margin-bottom: 0;
  display: flex;
  gap: 15px;
  
  button {
    width: 50%;
    height: 115px;
    font-size: 22px;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    p {
      font-size: 18px;
    }
  }
`
const Value = styled.div`
  font-size: 16px;
  text-align: right;
  color: ${(props) => (props.color === "positivo" ? "green" : "red")};
`
const ListItemContainer = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  color: #000000;
  margin-right: 10px;
  div span {
    color: #c6c6c6;
    margin-right: 10px;
  }
`
const Delete = styled.span`
  display: flex;
  color: #c6c6c6;
  height: auto;
  gap: 5px;
`

const WithouthInfo = styled.p`
  display: flex;
  margin: auto;
  font-size: 1.25rem;
  text-align: center;
`