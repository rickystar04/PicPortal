import React from "react";

// Componente A
class ComponenteA extends React.Component {
  funzioneDaChiamare = () => {
    // Logica da eseguire quando la funzione viene chiamata
    alert("La funzione è stata chiamata da ComponenteB!");
  };

  render() {
    return (
      <div>
        <h1>Componente A</h1>
        {/* Passa la funzione come prop a ComponenteB */}
        <ComponenteB chiamataFunzione={this.funzioneDaChiamare} />
      </div>
    );
  }
}

// Componente B
class ComponenteB extends React.Component {
  handleClick = () => {
    // Chiamata alla funzione passata come prop quando viene cliccato l'elemento in ComponenteB
    this.props.chiamataFunzione();
  };

  render() {
    return (
      <div>
        <h2>Componente B</h2>
        {/* Quando questo elemento viene cliccato, chiama la funzione nell'altro componente */}
        <button onClick={this.handleClick}>Clicca qui</button>
      </div>
    );
  }
}

export default ComponenteA;
