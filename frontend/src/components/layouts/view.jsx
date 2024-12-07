import Navbar from "../elements/navbar"
import Hero from "../elements/hero"
import Feature from "../elements/feature"
import Footer from "../elements/footer"

const View = () => {
    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex flex-col'>
            <Navbar />
            <Hero />
            <Feature />
            <Footer />
        </div>
    )
}

export default View