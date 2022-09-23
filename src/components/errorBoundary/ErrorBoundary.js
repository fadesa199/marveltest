import { Component } from "react";
import ErrorMassage from "../errorMessage/ErrorMassage";

class ErrorBoundary extends Component {
    state = {
        error: false
    }

    // static getDerivedStateFromError(error) {
    //     return {error:true}
    // }
    // аналог componentDidCatch, но данный метод изменяет только стейт

    componentDidCatch(error, errorInfo) {
        console.log(error, errorInfo)

        this.setState({
            error: true
        })
    }

    render() {
        if (this.state.error) {
            return <ErrorMassage />
        }
        return this.props.children;
    }

}

export default ErrorBoundary;

// componentDidCatch ловит ошибки в методе рендер, в методах жизненного цикла и в конструкторе.
// они не ловят ошибки, которые произошли в обработчиках событий, в асинхронном коде, и внутри себя 