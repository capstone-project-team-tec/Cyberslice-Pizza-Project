import { useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import "./locations.css"
import "./global.css"

const Locations = (props) => {
    return(
        <div id="locationsComponent">
            <div id="locationsComponentTitleContainer">
                <p id="locationsComponentTitleText">Locations</p>
            </div>
            <img id="locationsImage" src="/snazzyMapsMapFinal.png" alt="Image of Map Locations"/>
            <div id="locationsInfoContainerContainer">
            <div id="locationsInfoContainer">
                <li>123 Placeholder Street, Manhattan, NY, 12345</li>
                <li>456 Fake Blvd, Brooklyn, NY, 23456</li>
                <li>789 Notreal Lane, Queens, NY, 34567</li>
            </div>
            </div>
        </div>
    )
}
export default Locations;