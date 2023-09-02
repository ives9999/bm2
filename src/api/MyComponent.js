import React from "react";

class MyComponent extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        totalReactPackages: null
      };
    }
  
    componentDidMount() {
      //要傳送的json
      fetch("http://api.sportpassword.localhost/site/list"
        , {
            method: "GET",
            //body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json',
            })
        }
      )
      .then(response => response.json())
      .then(data => {
        this.setState({totalReactPackages: data.id})
        //console.info(data[0])
      }) //
      .catch(e => {
  
      })
    }
  
    render() {
      const { totalReactPackages } = this.state;
      return (
        <div className="card text-center m-3">
          <h5 className='card-header'>{totalReactPackages}</h5>
          {/* <div className='card-body'>
            Total react packages: {totalReactPackages}
          </div> */}
        </div>
      )
    }
  }

  export { MyComponent };