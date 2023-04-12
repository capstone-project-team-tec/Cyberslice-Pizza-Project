import "./locations.css"
import "./global.css"


const CarryoutLocation = ({ title, street, city, state, zip}) => {
    
    return (
        <section className="location">
            <section className="locationInfoContainer">
                <section className="locationTitle">
                    {title}
                </section>

                <section className="addressContainer">
                    
                    <section className="locationStreetContainer">
                        <section className="locationStreetTitle">
                            Street
                        </section>

                        <section className="locationStreet">
                            {street}
                        </section>
                    </section>

                    <section className="locationCityContainer">
                        <section className="locationCityTitle">
                            City
                        </section>

                        <section className="locationCity">
                            {city}
                        </section>
                    </section>

                    <section className="locationStateContainer">
                        <section className="locationStateTitle">
                            State
                        </section>

                        <section className="locationState">
                            {state}
                        </section>
                    </section>

                    <section className="locationZipContainer">
                        <section className="locationZipTitle">
                            Zip
                        </section>

                        <section className="locationZip">
                            {zip}
                        </section>

                    </section>
                </section>
            </section>
        </section>
    )
}

const Locations = () => {

    return(
        <div id="locationsComponent">
            <div id="locationsComponentTitleContainer">
                <p id="locationsComponentTitleText">Locations</p>
            </div>
            <div id="imageAndAddresses">
                <img id="locationsImage" src="/snazzyMapsMapFinal.png" alt="Image of Map Locations"/>
                <div id="locationsContainer">
                    <label htmlFor="CyberNet">
                        <CarryoutLocation
                            title="1. CyberNet"
                            street="4342 N Liberty Road"
                            city="New York City"
                            state="New York"
                            zip="10001"
                            />
                    </label>
                    <label htmlFor="TechnoCorp">
                        <CarryoutLocation 
                            title="2. TechnoCorp"
                            street="3697 S Red Planet Road"
                            city="New York City"
                            state="New York"
                            zip="70810"
                        />
                    </label>
                    <label htmlFor="SynthRunner">
                        <CarryoutLocation 
                            title="3. SynthRunner"
                            street="6201 Whispering Pines Lane"
                            city="New York City"
                            state="New York"
                            zip="03429"
                        />
                    </label>
                </div>
            </div>
        </div>
    )
}
export default Locations;