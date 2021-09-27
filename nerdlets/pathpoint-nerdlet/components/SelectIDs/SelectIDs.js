import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class SelectIDs extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            selected: 0
        };
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
        const { name, options } = this.props;
        const { selected } = this.state;
        const event = { target: { value: options[selected].id, name } };
        this.props.parentCallBack(event);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    myRef = React.createRef();

    handleClickOutside = e => {
        if (!this.myRef.current.contains(e.target)) {
            this.setState({ visible: false });
        }
    };

    clickAction = () => {
        this.setState(prevState => ({ open: !prevState.open }));
    };

    clickSelected = (optionSelected, obj) => {
        const { name, handleOnChange } = this.props;
        const event = { target: { value: obj.id, name } };
        this.setState({ selected: parseInt(optionSelected) });
        this.props.parentCallBack(event);
        //handleOnChange(event);
    };

    render() {
        const { options } = this.props;
        const { selected, open } = this.state;
        return (
            <div
                className="custom-select-wrapper"
                onClick={this.clickAction}
                ref={this.myRef}
            >
                <div
                    className="custom-select"
                    style={
                        open
                            ? { visibility: 'visible', pointerEvents: 'all', opacity: 1 }
                            : {}
                    }
                >
                    <div className="custom-select__trigger">
                        <span
                            style={{
                                width: '230px',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                                overflow: 'hidden'
                            }}
                        >
                            {options[selected].id}
                        </span>
                        <div className="arrow" />
                    </div>
                    <div
                        className="custom-options"
                        style={
                            open
                                ? { visibility: 'visible', pointerEvents: 'all', opacity: 1 }
                                : {}
                        }
                    >
                        {options.map((obj, index) => (
                            <span
                                key={index}
                                onClick={() => this.clickSelected(index, obj)}
                                className={
                                    selected === index
                                        ? 'custom-option selected'
                                        : 'custom-option'
                                }
                            >
                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                    <div style={{ display: 'flex', justifyContent: 'start', width: '50%' }}>
                                        {obj.name}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'start', width: '50%' }}>
                                        {obj.id}
                                    </div>
                                </div>

                            </span>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}

SelectIDs.propTypes = {
    options: PropTypes.array.isRequired,
    name: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    handleOnChange: PropTypes.func.isRequired
};