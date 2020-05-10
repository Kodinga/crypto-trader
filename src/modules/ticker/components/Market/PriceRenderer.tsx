import React, { Component } from 'react';
import UpdateHighlight from 'core/components/UpdateHighlight';

interface Props {
    valueFormatted: string;
}

interface State {
    valueFormatted: string;
}

class PriceRenderer extends Component<Props, State> {
    constructor(props: Props) {
      super(props);
  
      this.state = {
        valueFormatted: props.valueFormatted,
      };
    }

    refresh(params: Props) {
        this.setState({
            valueFormatted: params.valueFormatted,
        });
    
        return true;
      }


    render() {
        const { valueFormatted } = this.state;
        return <UpdateHighlight value={valueFormatted} />;
    }
}

export default PriceRenderer;