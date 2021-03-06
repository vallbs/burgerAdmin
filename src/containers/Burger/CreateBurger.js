import React, { Component } from 'react';
import axios from '../../axios';
import './CreateBurger.css';

class CreateBurger extends Component {
    componentDidMount = () => {
        axios.get("/ingredients.json")
            .then(response => {
                const data = response.data;
                let ingredients = Object.keys(data).map(key => {
                    return {
                        ...data[key],
                        id: key,
                        quantity: 0
                    }
                });
                ingredients = ingredients.sort( (a,b) => {
                    return a.name !== b.name ? a.name < b.name ? -1 : 1 : 0;
                });
                this.setState({ ingredients });
            })
            .catch(error => console.log(error));
    }

    handleNameChanges = (evt) => {
        this.setState({ burgerName: evt.target.value });
    }

    handleSaveBurger = evt => {
        evt.preventDefault();
        let ingredients = this.state.ingredients.filter(ing => {
            return ing.quantity > 0; 
        });

        //deleting ingredient price
        ingredients = ingredients.map(ing => {
            return {
                id: ing.id,
                name: ing.name,
                quantity: ing.quantity
            }
        });

        const burger = {
            ingredients,
            name: this.state.burgerName,
            price: this.state.burgerPrice
        }
        
        axios.post("/burgers.json", burger)
            .then(response => {
                this.props.history.goBack();
            })
            .catch(error => console.log(error));
    }

    handleCancelChanges = evt => {
        evt.preventDefault();
        this.props.history.goBack();
    }

    handleAddIngredient = (evt, ingredientId, ingredientPrice) => {
        evt.preventDefault();
        const ingredients = this.state.ingredients.map(ing => {
            if(ing.id === ingredientId) {
                return { 
                    ...ing, 
                    quantity: ing.quantity+1
                }
            }
            return ing;
        });

        this.setState({ 
            ingredients,
            burgerPrice: this.state.burgerPrice + 1*ingredientPrice
        });
        console.log("handleAddIngredient");
    }

    handleRemoveIngredient = (evt, ingredientId, ingredientPrice) => {
        evt.preventDefault();
        const ingredients = this.state.ingredients.map(ing => {
            if(ing.id === ingredientId) {
                return { 
                    ...ing, 
                    quantity: ing.quantity-1
                }
            }
            return ing;
        });
        this.setState({ 
            ingredients,
            burgerPrice: this.state.burgerPrice - 1*ingredientPrice
        });
    }

    render() {
        let ingredients = <p>loading...</p>
        if(this.state.ingredients) {
            ingredients = this.state.ingredients.map(ingredient => {
                return (
                    <div 
                        className="BurgerIngredientItem_new"
                        key={ingredient.id}>
                        <button 
                            className="BurgerIngredientItem--Add"
                            onClick={ (evt, ingredientId, ingredientPrice) => this.handleAddIngredient(evt, ingredient.id, ingredient.price)}
                            >+</button>
                        <div className="BurgerIngredientItem--srting">
                            <span className="">{ingredient.name}, </span>
                            <span className="">{ingredient.price} грн </span>
                            <span className="">({ingredient.quantity})</span>
                        </div>
                        
                        <button
                            className="BurgerIngredientItem--Add" 
                            onClick={ (evt, ingredientId, ingredientPrice) => this.handleRemoveIngredient(evt, ingredient.id, ingredient.price)}
                            disabled={ingredient.quantity === 0}
                            >-</button>
                        {/* <button 
                            className="BurgerButton BurgerButtonAdd"
                            onClick={ (evt, ingredientId, ingredientPrice) => this.handleAddIngredient(evt, ingredient.id, ingredient.price)}
                            >+</button>
                        <span className="IngredientQuantity">{ingredient.quantity}</span>
                        <button
                            className="BurgerButton BurgerButtonRemove" 
                            onClick={ (evt, ingredientId, ingredientPrice) => this.handleRemoveIngredient(evt, ingredient.id, ingredient.price)}
                            disabled={ingredient.quantity === 0}
                            >-</button>
                        <span className="IngredientName">{ingredient.name}</span>
                        <span className="IngredientPrice">{ingredient.price} грн</span> */}
                    </div>
                );        
            });
        }

        return (
            <div className="CreateBurger">
                <form onSubmit={ evt => this.handleSaveBurger(evt) }>
                    <div className="">
                        <p>
                            <label>Назва: </label>
                            <input 
                                onChange={ evt => this.handleNameChanges(evt) }
                                type="text" 
                                name="name"/>
                        </p>
                        <p>
                            <span>Ціна: {this.state.burgerPrice}</span>
                        </p>

                        <input 
                            className="BurgerButton BurgerButtonSave" 
                            type="submit" 
                            value="зберегти" />
                        <button 
                            className="BurgerButton BurgerButtonCancel"
                            onClick={ evt => this.handleCancelChanges(evt) }
                            >відмінити
                        </button>

                        <div className="">
                            <hr />
                            <p>інгредієнти</p>
                            { ingredients }
                        </div>
                    </div>
                    <hr />
                </form>
            </div>
        );
    }

    state = {
        burgerName: null,
        burgerPrice: 0,
        ingredients: null,
        saving: false
    }
}

export default CreateBurger;