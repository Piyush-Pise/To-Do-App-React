import "./connectingComponent.css"

function ConnectingComponent(prop)
{
    return(
        <div className={"connecting-container-" + (prop.isConnecting ? "active" : "inactive")} >
            Connecting to the server
            {/* <div className="filler"></div> */}
        </div>
    )
}

export default ConnectingComponent;