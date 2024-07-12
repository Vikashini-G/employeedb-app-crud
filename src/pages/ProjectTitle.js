import './ProjectTitle.css';
import myLogo from '../images/myLogo.png';

const ProjectTitle = () => {
    return(
        <div class="headerContent">
            <a href="https://github.com/Vikashini-G">
                <img id = "myLogo" src={myLogo}/>
            </a>
            <p>Employee Management Application</p>
        </div>
    );
};
export default ProjectTitle;