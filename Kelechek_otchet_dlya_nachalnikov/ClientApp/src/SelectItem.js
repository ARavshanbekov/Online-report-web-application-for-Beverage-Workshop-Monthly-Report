import React, { Component } from "react";
import styled from "styled-components";

export default class SelectItem extends Component {
    selectStyle(selected, value) {
        return selected === value ? "red" : "black";
    }

    render() {
        const { onSelect, selected } = this.props;
        return (
            <div>
                Selected item: {selected}
                <br />
        Selection should update here!!
                <ul>
                    <Item
                        style={{ color: this.selectStyle(selected, "first") }}
                        onClick={() => onSelect("first")}
                    >
                        First
          </Item>
                    <Item
                        style={{ color: this.selectStyle(selected, "second") }}
                        onClick={() => onSelect("second")}
                    >
                        Second
          </Item>
                </ul>
            </div>
        );
    }
}

const Item = styled.li`
  cursor: pointer;
`;
