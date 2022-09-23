import './charInfo.scss';
import { Component } from 'react';
import PropTypes from 'prop-types';
import MarvelService from '../../services/MarvelService';
import Skeleton from '../skeleton/Skeleton';
import Spinner from '../spinner/Spinner';
import ErrorMassage from '../errorMessage/ErrorMassage';

class CharInfo extends Component {
    state = {
        char: null,
        loading: false,
        error: false,
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.updateChar();
    }
    componentDidUpdate(prevProps) {
        if (this.props.charId !== prevProps.charId) {
            this.updateChar();
        }
    };


    onCharLoaded = (char) => {
        this.setState({ char, loading: false })
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    onToggleError = () => {
        this.setState({ error: false })
    }

    onCharLoading = () => {
        this.setState({ loading: true })
    }

    updateChar = () => {
        const { charId } = this.props;
        if (!charId) {
            return
        }

        if (!this.state.error) {
            this.onCharLoading();
            this.marvelService
                .getCharacter(charId)
                .then(this.onCharLoaded)
                .catch(this.onError)
        }

        else {
            this.onToggleError();
        }
    }
    render() {
        const { char, loading, error } = this.state;
        const skeleton = char || loading || error ? null : <Skeleton />
        const errorMessage = error ? <ErrorMassage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(errorMessage || spinner || !char) ? <View char={char} /> : null;

        return (
            <div className="char__info">
                {skeleton}
                {errorMessage}
                {spinner}
                {content}
            </div>
        )
    }


}

const View = ({ char }) => {
    const { name, thumbnail, description, homepage, wiki, comics } = char;
    let imgStyle = { 'objectFit': 'cover' };
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = { 'objectFit': 'contain' }
    }



    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imgStyle} />
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length ? null : 'Нет комиксов'}
                {comics.slice(0, 10).map((item, i) => {
                    return (
                        <li className='char__comics-item' key={i}>
                            {item.name}
                        </li>
                    )
                })
                }
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}




export default CharInfo;