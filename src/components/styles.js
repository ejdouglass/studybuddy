import styled, { keyframes, css } from 'styled-components';

// Base color: hsla(230, 70%, 35%, 1)

const colors = {
    base: 'hsla(230, 70%, 35%, 1)',
    pale: 'hsla(230, 70%, 35%, 0.3)',
    blackish: 'hsla(230, 70%, 25%, 1)'
}

const materializeIn = keyframes`
    from {
        transform: translate(0, 5%);
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
    font-size: 1.1rem;
    padding: 6px 12px;
    border-radius: 6px;
    width: 150px;
    margin: 0.5rem;
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
        margin: 0;
    `}
    ${props => props.right && css`
        border-radius: 0 6px 6px 0;
        margin: 0;
    `}
    ${props => props.segment && css`
        border-radius: 0;
        border-right: 2px solid hsl(230, 80%, 20%);
        margin: 0;
    `}
    ${props => props.tall && css`
        height: 50px;
    `}
    ${props => props.itty && css`
        width: 80px;
        font-size: 0.7rem;
        font-weight: 600;
    `}
    ${props => props.huge && css`
        height: 100px;
        border-radius: 10px;
        font-size: 1.5rem;
    `}
    ${props => props.bold && css`
        background-color: hsla(340, 60%, 50%, 1);
    `}
    ${props => props.grayed && css`
        opacity: 0.4;
        color: hsla(240, 30%, 100%, 0.9);
    `}
    ${props => props.elbowroom && css`
        margin-left: 8px;
        margin-right: 8px;
    `}
    ${props => props.roomy && css`
        margin: 8px;
    `}
    ${props => props.wide && css`
        width: 300px;
    `}
    ${props => props.rightside && css`
        align-self: flex-end;
    `}
    ${props => props.leftside && css`
        align-self: flex-start;
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
    ${props => props.fullwidth && css`
        width: 100%;
    `}
    ${props => props.fullheight && css`
        height: 100%;
    `}
    ${props => props.wide && css`
        width: 80%;
    `}
    ${props => props.tall && css`
        height: 80%;
    `}
    ${props => props.halfwidth && css`
        width: 50%;
    `}
    ${props => props.halfheight && css`
        height: 50%;
    `}
    ${props => props.quarterwidth && css`
        width: 25%;
    `}
    ${props => props.quarterheight && css`
        height: 25%;
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
    ${props => props.headroom && css`
        margin-top: 16px;
    `}
`;

export const DecksList = styled(ContentContainer)`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: flex-start;
    align-items: flex-start;
    

    padding: 12px;
    margin: 12px;
    width: 480px;
    height: 50vh;
    border: 2px solid hsla(230, 80%, 15%, 0.3);
    border-radius: 6px;
`;

export const DeckSelectorMenu= styled(ContentContainer)`
    display: flex;
    flex-direction: column;
    width: 200px;
    height: 50vh;
`;

export const Deck = styled.div`
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
    margin-right: 12px;
    margin-bottom: 16px;
    font-size: 16px;
    box-shadow: 4px 8px 10px hsl(230, 80%, 30%), 8px 4px 10px hsl(230, 80%, 30%), 8px 8px 10px hsl(230, 80%, 30%);
    padding: 6px 12px;
    border-radius: 6px;
    width: 100px;
    height: 60px;
    background-color: hsla(230, 40%, 60%, 1);
    font-weight: 600;
    border: 0;
    color: white;
`;

export const BigDeck = styled(Deck)`
    flex-direction: column;
    width: 400px;
    height: 240px;
    margin-right: 48px;
    margin-bottom: 64px;
    background-color: hsla(230, 35%, 70%, 1);
`;

export const DeckCard = styled(BigDeck)`
    width: 200px;
    height: 120px;
    font-size: 1.1rem;
    margin-right: 1rem;
    margin-bottom: 1rem;
    box-shadow: none;
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
    font-size: 1.1rem;
    color: ${colors.blackish};
    padding: 0.8rem 1rem;
    margin: 1rem;
    width: 200px;
    ${props => props.centered && css`
        text-align: center;
    `}
    ${props => props.elbowroom && css`
        margin-left: 16px;
        margin-right: 16px;
    `}
    ${props => props.elbowroom && css`
        margin-left: 16px;
        margin-right: 16px;
    `}
    ${props => props.wide && css`
        width: 400px;
    `}
    ${props => props.doublewide && css`
        width: 600px;
    `}
    ${props => props.tight && css`
        margin-top: 0;
        margin-bottom: 0;
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
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
    text-align: center;
    color: ${colors.blackish};
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
    ${props => props.white && css`
        color: white;
    `}
`;

export const Text = styled.p`
    font-size: 1.1rem;
    margin: 0.5rem;
    line-height: 1.5;
    color: ${colors.blackish};
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    ${props => props.white && css`
        color: white;
    `}
`;

export const ButtonPrompt = styled(Text)`
    margin: 12px;
`;

export const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0.8rem;
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
    background-color: hsl(240, 5%, 100%);
    border: 1px solid hsla(240, 60%, 10%, 0.3);
    position: fixed;
    width: calc(100px + 30vw);
    height: 150px;
    left: calc(35vw - 50px);
    bottom: 20px;
    animation: ${materializeIn} 0.2s linear;
`;

export const RowContainer = styled(ContentContainer)`
    flex-direction: row;
    ${props => props.screenwidth && css`
        width: 100vw;
    `}
    ${props => props.fullwidth && css`
        width: 100%;
    `}
    ${props => props.halfwidth && css`
        width: 100vw;
    `}
`;

export const ColumnContainer = styled(ContentContainer)`
    flex-direction: column;
    ${props => props.screenheight && css`
        width: 100vh;
    `}
    ${props => props.uncentered && css`
        align-items: flex-start;
    `}
`;

export const CardCollection = styled(ContentContainer)`
    flex-direction: row;
    justify-content: center;
    align-content: flex-start;
    align-items: center;
    margin: 1.5rem;
    padding: 1rem;
    width: 100%;
    height: 400px;
    border-radius: 6px;
    border: 1px solid ${colors.blackish};
`;

export const DeckCollection = styled(CardCollection)`
    
`;

export const Form = styled.form`
    display: flex;
    width: 100%;
    flex-direction: column;
    ${props => props.row && css`
        flex-direction: row;
    `}
    ${props => props.centered && css`
        justify-content: center;
        align-items: center;
    `}
`;

export const Card = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1rem;
    margin: 1rem;
    align-items: center;
    width: 250px;
    height: 200px;
    border-radius: 12px;
    border: 2px solid ${colors.pale};
    &:hover {
        background-color: ${colors.pale};
        transform: translateY(-1px);
    }
`;

export const TopicsContainer = styled(ContentContainer)`
    flex-direction: row;
    justify-content: space-around;
    align-content: flex-start;
    flex-wrap: wrap;
`;

export const NotepadToolbar = styled(ContentContainer)`
    flex-direction: row;
    justify-content: space-around;
    padding: 4px;
    width: 100%;
    border-bottom: 1px solid ${colors.blackish};
`;

export const NoteToolButton = styled(Button)`
    margin: 0 0.5rem;
    padding: 0;
    width: 50px;
    height: 50px;
    background-color: ${colors.base};
    &:hover {
        transform: translateY(-1px);
    }
`;

export const Notepad = styled(ContentContainer)`
    flex-direction: row;
    align-content: flex-start;
    flex-wrap: wrap;
    width: 85vw;
    height: 60vh;
    border-radius: 10px;
    border: 2px solid ${colors.pale};
`;

export const Word = styled(Text)`
    margin: 1.5rem;
`;