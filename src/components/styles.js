import styled, { keyframes, css } from 'styled-components';

// Base color: hsla(230, 70%, 35%, 1)

export const AppHeader = styled.div`
    display: flex;
    height: 100px;
    justify-content: center;
    align-items: center;
    background-color: hsla(230, 70%, 35%, 1);
    color: white;
`;

export const NavContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 80vw;
    justify-content: flex-end;
`;

export const Button = styled.button`
    font-size: 16px;
    padding: 6px 12px;
    border-radius: 6px;
    width: 200px;
    background-color: hsla(230, 40%, 60%, 1);
    font-weight: 600;
    border: 0;
    color: white;
    &:focus {
        outline: none;
    }
    ${props => props.selected && css`
        background-color: hsla(210, 80%, 80%, 1);
        color: hsla(230, 30%, 10%, 0.8);
        font-weight: 800;
    `}
    ${props => props.left && css`
        border-radius: 6px 0 0 6px;
        border-right: 2px solid hsl(230, 80%, 20%);
    `}
    ${props => props.right && css`
        border-radius: 0 6px 6px 0;
    `}
    ${props => props.segment && css`
        border-radius: 0;
        border-right: 2px solid hsl(230, 80%, 20%);
    `}
`;

export const ValueModifierButton = styled(Button)`
    width: 50px;
    height: 50px;
    font-weight: 900;
    font-size: 24px;
`;

export const InputContainer = styled.div`
    display: flex;
    align-items: center;
    ${props => props.row && css`
        flex-direction: row;
    `}
    ${props => props.column && css`
        flex-direction: column;
    `}
    ${props => props.wide && css`
        width: 100%;
    `}
`;

export const SessionVariablesContainer = styled(InputContainer)`
    height: 50px;
`;

export const Select = styled.select`

`;

export const Input = styled.input`
    font-size: 18px;
    padding: 12px 16px;
    ${props => props.centered && css`
        text-align: center;
    `}
`;

export const Segment = styled.div`
    display: flex;
    width: 100%;
    flex-direction: row;
    ${props => props.half && css`
        width: 50%;
    `}
    ${props => props.quarter && css`
        width: 25%;
    `}
`;

export const Title = styled.h1`
    font-size: 24px;
    margin: 16px;
`;

export const ButtonPrompt = styled.p`
    font-size: 18px;
    margin: 12px;
`;

export const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100vw;
    height: calc(100vh - 100px);
`;

export const NavButton = styled(Button)`
    width: 100px;
    margin-right: 18px;
    &:hover {
        background-color: hsla(230, 45%, 70%, 1);
        color: white;
        transform: translateY(-1px);
    }
`;