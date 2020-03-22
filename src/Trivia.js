import React from 'react';
import he from 'he';
import Switch from "react-switch";
import Select from 'react-select';
import Choice from './Choice';

class Trivia extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            type: 'Trivia Type',
            difficulty: '',
            question: 'Nice job, you broke it.',
            choices: [],
            answer: '',
            category: '',
            reveal: false,
            show_choices: false,
            selected_choice: '',
            next_disabled: true,
            settings_open: false,
            categories: [],
            selected_categories: [],
            session_token: ''
        };
    }

    toggleChoices(checked) {//change of switch for choices
        this.setState({ show_choices: checked, selected_choice: '', reveal: false});
    }

    categoryChange(selected_categories) {
        this.setState({selected_categories});
    }

    setSelected(selected_choice) {
        if(this.state.selected_choice === '' && !this.state.reveal && this.state.show_choices) {
            this.setState({selected_choice, show_choices: true, reveal: true, next_disabled: false});
        }
    }
    
    render() {
        if (this.state.loading) {
            return <div><img src={require('./images/Wedges-3s-200px.svg')} alt='Loading'/></div>
        }

        return (
            <div className='trivia-holder'>
                {this.state.settings_open ?
                    <div style={{padding: '2vh'}}>
                        <span onClick={() => this.setState({ settings_open: false })}> [Close] </span>
                        <Select isMulti options={this.state.categories}
                        onChange={this.categoryChange.bind(this)}
                        value={this.state.selected_categories}
                        // onChange={(category)=>this.setState({category})} value={this.state.categories[0]} placeholder="Select an option"

                        />
                    </div>
                    :
                    <div>
                        <span onClick={() => this.setState({ settings_open: true })}>...</span>
                    </div>
                }
                <div className='trivia-text'>
                    <div className="row">
                        <div className="type-text">{this.state.type === 'boolean' ? 'True or False' : 'Multiple Choice'}</div>
                        <Switch onChange={this.toggleChoices.bind(this)} checked={this.state.show_choices} />
                    </div>
                    <div className='category-text'>{this.state.category} ({this.state.difficulty})</div>

                    <div className='question-text'>{this.state.question}</div>
                            <ul className='choices'>
                                {this.state.choices.map((choice, key) => {
                                    return (
                                        <li key={key}>
                                            <Choice 
                                            text={choice} 
                                            show={this.state.show_choices}
                                            correct={this.state.answer === choice}
                                            reveal={this.state.reveal}
                                            selected={this.state.selected_choice === choice}
                                            setSelected={(e)=> this.setSelected(e)}
                                            />
                                        </li>
                                    );
                                })}
                            </ul> 
                </div>

                <div className='button-holder'>
                    {this.state.reveal === false ?
                        <button onClick={() => this.setState({ reveal: true, next_disabled: false, show_choices: true })}>Show Answer</button>
                        :
                        <button onClick={() => this.setState({ reveal: false, selected_choice: '' })}>Hide Answer</button>
                    }
                    <button hidden={this.state.next_disabled} onClick={() => this.fetchQuestion()}>New Question</button>
                </div>
            </div>
        );
    }

    componentDidMount() {
        this.fetchToken();//This fetches token, then calls fetchCategories, then fetchQuestion
    }

    fetchToken() {
        // Fetch a new token to ensure no repeats for the session
        fetch("https://opentdb.com/api_token.php?command=request").then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        session_token: result.token
                    });

                    this.fetchCategories();
                },
                (error) => {
                    this.setState({
                        loading: false,
                        question: error.message
                    });
                }
            )
    }

    fetchCategories() {
        fetch("https://opentdb.com/api_category.php").then(res => res.json())
            .then(
                (result) => {

                    for (var i = result.trivia_categories.length - 1; i > 0; i--) {// convert json keys from api json to what the dropdown uses
                        
                        var obj = result.trivia_categories[i];
                        obj.value = obj.id;
                        delete obj.id;

                        obj.label = obj.name;
                        delete obj.name;
                        result.trivia_categories[i] = obj;
                    }

                    this.setState({
                        categories: result.trivia_categories,
                        selected_categories: result.trivia_categories
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
        this.setState({ loading: true, settings_open: false });
        var url = "https://opentdb.com/api.php?amount=1";

        if(this.state.session_token !== '') {
            url += "&token="+this.state.session_token;
        }
        if(this.state.selected_categories.length < this.state.categories.length && this.state.selected_categories.length > 0) {
            url += "&category="+this.pickCategory();
        }


        fetch(url)
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result.results[0]);
                    this.setState({
                        reveal: false,
                        loading: false,
                        next_disabled: true,
                        show_choices: false,
                        selected_choice: '',
                        type: result.results[0].type,
                        difficulty: result.results[0].difficulty,
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

    pickCategory() {
        var index = Math.floor(Math.random() * (this.state.selected_categories.length));
        return this.state.selected_categories[index].value;
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