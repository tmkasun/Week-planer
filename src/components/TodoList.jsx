import React, { useState } from "react";
import { getVisibleTodos } from "../data/utilities";

import { TodoItem } from "./TodoItem";

export default function TodoList(props) {
    const { todos, onDelete, onUpdate } = props;
    const [showActive, setShowActive] = useState(false);
    const visibleTodos = getVisibleTodos(todos.list, showActive);

    return (
        <div className="todo-list">
            <div className="active-selector">
                <input
                    id="show-only-active-todos"
                    type="checkbox"
                    className="show-only-active"
                    checked={showActive}
                    onChange={(e) => setShowActive(e.target.checked)}
                />
                <label htmlFor="show-only-active-todos">
                    Show only active todos
                </label>
            </div>
            <ul>
                {visibleTodos.map((todo) => (
                    <TodoItem onUpdate={onUpdate} onDelete={onDelete} key={todo.id} todo={todo} />
                ))}
            </ul>
        </div>
    );
}
