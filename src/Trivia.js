import React from 'react';
import he from 'he';

class Trivia extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            type: 'Trivia Type',
            question: 'Well that wasn\'t supposed to happen...',
            choices: [],
            answer: ':(',
            reveal: false
        };
    }

    render() {
        if (this.state.loading) {
            return <div>Loading...</div>
        }

        return (
            <div className='trivia-holder'>
                <div className='trivia-text'>
                    <div className="type-text">{this.state.type === 'boolean' ? 'True or False' : 'Multiple Choice'}</div>

                    <div className='question-text'>{this.state.question}</div>

                    {this.state.reveal === false ?
                        <ul className='choices'>
                            {this.state.choices.map(function (choice) {
                                return <li>{choice}</li>;
                            })}
                        </ul>
                        :
                        <div className='answer-text'>{this.state.answer}</div>}
                </div>

                <div className='button-holder'>
                    {this.state.reveal === false ?
                        <button onClick={() => this.setState({ reveal: true })}>Show Answer</button>
                        :
                        <button onClick={() => this.setState({ reveal: false })}>Hide Answer</button>
                    }
                    <button onClick={() => this.fetchQuestion()}>New Question</button>
                </div>
            </div>
        );
    }

    componentDidMount() {
        this.fetchQuestion();
    }

    fetchQuestion() {
        fetch("https://opentdb.com/api.php?amount=1")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        reveal: false,
                        loading: false,
                        type: result.results[0].type,
                        question: he.decode(result.results[0].question),
                        answer: result.results[0].correct_answer
                    });

                    if (this.state.type === 'boolean') {
                        this.setState({
                            choices: ['True', 'False']
                        });
                    } else {
                        var choices = result.results[0].incorrect_answers;
                        choices.push(result.results[0].correct_answer);

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