import styled, { keyframes, css } from 'styled-components';

// Base color: hsla(230, 70%, 35%, 1)

const materializeIn = keyframes`
    from {
        transform: translate(-5%, 0);
        opacity: 0;
    }

    to {
        transform: translate(0, 0);
        opacity: 1;
    }
`;

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
    width: 150px;
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
    ${props => props.tall && css`
        height: 50px;
    `}
    ${props => props.tall && css`
        background-color: hsla(340, 50%, 50%, 1);
    `}
`;

export const ValueModifierButton = styled(Button)`
    width: 50px;
    height: 50px;
    font-weight: 900;
    font-size: 24px;
`;

export const ContentContainer = styled.div`
    display: flex;
    align-items: center;
    ${props => props.row && css`
        flex-direction: row;
    `}
    ${props => props.column && css`
        flex-direction: column;
    `}
    ${props => props.full && css`
        width: 100%;
    `}
    ${props => props.wide && css`
        width: 80%;
    `}
    ${props => props.half && css`
        width: 50%;
    `}
    ${props => props.quarter && css`
        width: 25%;
    `}
    ${props => props.tall && css`
        height: 75vh;
    `}
    ${props => props.short && css`
        height: 25vh;
    `}
    ${props => props.centered && css`
        justify-content: center;
    `}
    ${props => props.cushioned && css`
        justify-content: space-around;
    `}
    ${props => props.spaced && css`
        justify-content: space-between;
    `}
`;

export const DecksList = styled(ContentContainer)`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-items: space-around;

    padding: 12px;
    width: 460px;
    height: 50vh;
    border: 2px solid hsla(230, 80%, 15%, 0.3);
    border-radius: 6px;
`;

export const Deck = styled.div`
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
    margin-right: 16px;
    font-size: 24px;
    box-shadow: 4px 8px 10px hsl(230, 80%, 30%), 8px 4px 10px hsl(230, 80%, 30%), 8px 8px 10px hsl(230, 80%, 30%);
    padding: 6px 12px;
    border-radius: 6px;
    width: 200px;
    height: 120px;
    background-color: hsla(230, 40%, 60%, 1);
    font-weight: 600;
    border: 0;
    color: white;
`;

export const InputContainer = styled(ContentContainer)`
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

export const Title = styled.p`
    font-size: 24px;
    ${props => props.roomy && css`
        margin: 16px;
    `}
    ${props => props.headroom && css`
        margin-top: 16px;
    `}
    ${props => props.footroom && css`
        margin-bottom: 16px;
    `}
    ${props => props.elbowroom && css`
        margin-left: 16px;
        margin-right: 16px;
    `}
    ${props => props.big && css`
        font-size: 36px;
    `}
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

export const AlertContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 16px;
    border: 1px solid hsla(240, 60%, 10%, 0.3);
    position: fixed;
    width: 40vw;
    height: 150px;
    left: 30vw;
    bottom: 20px;
    animation: ${materializeIn} 0.2s linear;
`;