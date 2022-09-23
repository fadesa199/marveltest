import './charList.scss';
import { Component } from 'react';
import PropTypes from 'prop-types';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMassage from '../errorMessage/ErrorMassage';




class CharList extends Component {
    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 1540,
        charEnded: false
    }

    marvelService = new MarvelService;

    componentDidMount() {
        this.onRequest();
    }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }


    onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        this.setState(({ charList, offset }) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }))
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    itemsRef = [];

    setCharRef = elem => {
        this.itemsRef.push(elem)
    }

    onFocus = (id) => {
        this.itemsRef.forEach(item => item.classList.remove("char__item_selected"));
        this.itemsRef[id].classList.add("char__item_selected");
        this.itemsRef[id].focus();
    }


    renderItems = (arr) => {
        const items = arr.map((item, i) => {
            let imgStyle = { 'objectFit': 'cover' }
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = { 'objectFit': 'unset' }
            }


            return (
                <li
                    className="char__item"
                    tabIndex={0}
                    ref={this.setCharRef}
                    key={item.id}
                    onClick={() => {
                        this.props.onCharSelected(item.id);
                        this.onFocus(i)
                    }}
                    onKeyPress={(e) => {
                        if (e.key === " " || e.key === 'Enter') {
                            this.props.onCharSelected(item.id);
                            this.onFocus(i);
                        }
                    }}>

                    <img src={item.thumbnail} alt={item.name} style={imgStyle} />
                    <div className="char__name">{item.name}</div>
                </li>
            )
        })

        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    render() {
        const { charList, loading, error, offset, newItemLoading, charEnded } = this.state;
        const items = this.renderItems(charList);
        const spinner = loading ? <Spinner /> : null;
        const errorMessage = error ? <ErrorMassage /> : null;
        const content = !(error || loading) ? items : null;



        return (
            <div className="char__list">
                {content}
                {errorMessage}
                {spinner}
                <button className="button button__main button__long"
                    style={{ 'display': charEnded ? 'none' : 'block' }}
                    disabled={newItemLoading}
                    onClick={() => this.onRequest(offset)}
                >
                    <div className="inner">load more</div>
                </button>
            </div >
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;
























// renderItems = (arr) => {
//     const items = arr.map((item) => {
//         let imgStyle = { 'objectFit': 'cover' };
//         if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
//             imgStyle = { 'objectFit': 'unset' };
//         }

//         return (
//             <li
//                 className="char__item"
//                 key={item.id}>
//                 <img src={item.thumbnail} alt={item.name} style={imgStyle} />
//                 <div className="char__name">{item.name}</div>
//             </li>
//         )
//     });

//     return (
//         <ul className="char__grid">
//             {items}
//         </ul>
//     )
// }


// const { charList, loading, error } = this.state;
// const items = this.renderItems(charList);
// const errorMessage = error ? <ErrorMassage /> : null;
// const spinner = loading ? <Spinner /> : null;
// const content = !(errorMessage || spinner) ? items : null;

// return (
//     <div className="char__list">
//         {content}
//         {errorMessage}
//         {spinner}
