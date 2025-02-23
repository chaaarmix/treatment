import React from 'react';

const Error = () => {

    return (
        <div className="App enter">
            <div className="error-block row-container">
                <div className="img-container error-block__img">
                    <img src="/assets/images/error.png" alt="logo"/>
                </div>
                <div className="error-block__text col container ">
                    <p className="error__text__oi">ОЙ!</p>
                    <p>Данная страница не существует</p>
                </div>
            </div>
        </div>
    );
};

export default Error;