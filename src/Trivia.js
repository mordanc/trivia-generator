import React from 'react';
import he from 'he';
import Switch from "react-switch";

class Trivia extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            type: 'Trivia Type',
            question: 'Well that wasn\'t supposed to happen...',
            choices: [],
            answer: '',
            category: '',
            reveal: false,
            show_choices: false,
            next_disabled: true
        };
    }
    handleChange(checked) {
        this.setState({ show_choices: checked });
    }
    render() {
        if (this.state.loading) {
            return <div>Loading...</div>
        }

        return (
            <div className='trivia-holder'>
                <div className='trivia-text'>
                    <div className="row">
                        <div className="type-text">{this.state.type === 'boolean' ? 'True or False' : 'Multiple Choice'}</div>
                        <Switch onChange={this.handleChange.bind(this)} checked={this.state.show_choices} />
                    </div>
                    <div className='category-text'>{this.state.category}</div>

                    <div className='question-text'>{this.state.question}</div>

                    {this.state.reveal === false ?
                        (this.state.show_choices ?
                            <ul className='choices'>
                                {this.state.choices.map(function (choice) {
                                    return <li>{choice}</li>;
                                })}
                            </ul> : null)
                        :
                        <div className='answer-text'>{this.state.answer}</div>}
                </div>

                <div className='button-holder'>
                    {this.state.reveal === false ?
                        <button onClick={() => this.setState({ reveal: true, next_disabled: false })}>Show Answer</button>
                        :
                        <button onClick={() => this.setState({ reveal: false })}>Hide Answer</button>
                    }
                    <button hidden={this.state.next_disabled} onClick={() => this.fetchQuestion()}>New Question</button>
                </div>
            </div>
        );
    }

    componentDidMount() {
        // Fetch a new token to ensure no repeats for the session
        fetch("https://opentdb.com/api_token.php?command=request").then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        session_token: result.token
                    });

                    // Generate a new trivia question
                    this.fetchQuestion();
                },
                (error) => {
                    this.setState({
                        loading: false,
                        question: error.message
                    });
                }
            )

    }

    fetchQuestion() {
        var url = "https://opentdb.com/api.php?amount=1&token=" + this.state.session_token;


        fetch(url)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        reveal: false,
                        loading: false,
                        next_disabled: true,
                        show_choices: false,
                        type: result.results[0].type,
                        question: he.decode(result.results[0].question),
                        answer: he.decode(result.results[0].correct_answer),
                        category: result.results[0].category
                    });

                    if (this.state.type === 'boolean') {
                        this.setState({
                            choices: ['True', 'False']
                        });
                    } else { //For multiple choice
                        // Put incorrect and correct choices into array
                        var choices = result.results[0].incorrect_answers;
                        choices.push(result.results[0].correct_answer);

                        // Decode all choices
                        for (var i = choices.length - 1; i > 0; i--) {
                            choices[i] = he.decode(choices[i]);
                        }

                        this.setState({
                            choices: this.shuffle(choices)
                        })
                    }
                },
                (error) => {
                    this.setState({
                        loading: false,
                        question: error.message
                    });
                }
            )
    }

    // Scramble the choices so correct position isn't predictable
    shuffle(arr) {
        var i,
            j,
            temp;
        for (i = arr.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
        return arr;
    }
}
export default Trivia;