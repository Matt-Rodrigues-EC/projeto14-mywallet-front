import axios from "axios";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import MyWalletLogo from "../components/MyWalletLogo";
import { useState } from "react";


export default function SignInPage() {
  
  const Navigator = useNavigate();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);

  function login(email, password){

    const body = {email: email, password: password};
    axios.post(`${process.env.REACT_APP_API_URL}/login`, body)
      .then((response) =>{
        localStorage.setItem("token", response.data.token);
        Navigator("/home");
      })
      .catch((error) => {
        alert(error.response.data)
        setLoading(false)
      })
  }

  return (
    <SingInContainer>
      <form action="">
        <MyWalletLogo />
        <input 
              placeholder="E-mail" 
              type="email" 
              value={email} 
              onChange={(e) => {setEmail(e.target.value)}}
        />
        <input 
              placeholder="Senha" 
              type="password" 
              autocomplete="new-password" 
              value={password} 
              onChange={(e) => {setPassword(e.target.value)}} 
        />
        <button type="button" disabled={loading} onClick={(e) => {setLoading(true); login(email, password);}}>Entrar</button>
      </form>
      <span></span>

      <Link to={"/cadastro"}>
        Primeira vez? Cadastre-se!
      </Link>
    </SingInContainer>
  )
}

const SingInContainer = styled.section`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`


