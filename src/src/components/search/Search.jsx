import './search.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const Search = ({socket,setSearchTerm, setLoading, loading,errorMessage,setErrorMessage}) =>{

    const onSubmit = async (event)=>{
        event.preventDefault()
        const form = new FormData(event.target)
        const formObj = Object.fromEntries(form)
        const isFormValid = await isValidForm(formObj)

        if(!isFormValid)
            return
        setErrorMessage("")
        setSearchTerm(formObj.stringToSearch)
        socket.send(JSON.stringify( formObj));
        setLoading(true)
    }

    const isValidForm = async(formObj) =>{
        if(Object.values(formObj).some((value) => value === '')){
            setErrorMessage("input cant be empty")
            return false
        }
        if(formObj.maxDepth > 5){
            setErrorMessage("the maximum depth is 5")
            return false
        }
        if(formObj.maxLinks > 5){
            setErrorMessage("maximum 5 links is page")
            return false
        }
        return true
    }

    return(<div className="form-container">
            <form className="form" onSubmit={onSubmit}>
                <h2 className="form-title">Search</h2>
                <div className="inputs-container">
                    <input type="text" placeholder="search here" name="stringToSearch"/>
                    <input type="text" placeholder="start url" name="startUrl"/>
                    <input type="number" placeholder="max depth" min={1} name="maxDepth" />
                    <input type="number" placeholder="max links in page" min={1} name="maxLinks" />
                    <button type="submit" className="submit-btn" disabled={loading} >Search{loading && <FontAwesomeIcon icon={faSpinner} spin />}</button>
                </div>
                {errorMessage !== "" && <div className="error-message">{errorMessage}</div>}
            </form>
        </div>
    )
}

export default Search