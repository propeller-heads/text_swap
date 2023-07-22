import React, { ButtonHTMLAttributes, useState } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'yes' | 'no';
  isDisabled?: boolean;

}

const Button: React.FC<ButtonProps> = ({ children, variant, isDisabled, ...rest }) => {
    var disability = isDisabled ? "disabled": "enabled"
  return (
    <button {...rest} className={`${disability}-button`} disabled>
      {children}
    </button>
  );
};

interface ButtonPairProps {
  onYesClick: () => void;
  onNoClick: () => void;
  isYesDisabled?: boolean; 
  isNoDisabled?: boolean;
}

const ButtonPair: React.FC<ButtonPairProps> = ({ onYesClick, onNoClick, isYesDisabled,  isNoDisabled}) => {
  return (
    <div className="button-pair">
      <Button variant="yes" onClick={onYesClick} isDisabled={isYesDisabled}>
        Yes
      </Button>
      <Button variant="no" onClick={onNoClick} isDisabled={isNoDisabled}>
        No
      </Button>
    </div>
  );
};

interface ChatMessage {
  role: string;
  content: {
    message: string;
  };
}

interface ChatWithButtonPairProps {
  chat: ChatMessage;
  onYesClick: () => void;
  onNoClick: () => void;
  isYesDisabled: boolean;
  isNoDisabled: boolean;
}

const ChatWithButtonPair: React.FC<ChatWithButtonPairProps> = ({
  chat,
  onYesClick,
  onNoClick,
  isYesDisabled,
  isNoDisabled,
}) => {

  return (
    <div>
      <p className={chat.role === "user" ? "user_msg" : "agent_msg"}>
        <span>{chat.content.message}</span>
      </p>
      <ButtonPair
        onYesClick={onYesClick}
        onNoClick= {onNoClick}
        isYesDisabled={isYesDisabled}
        isNoDisabled={isNoDisabled}
      />
    </div>
  );
};

export default ChatWithButtonPair;