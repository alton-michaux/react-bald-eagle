import PropTypes from "prop-types"
import styles from "../../Assets/css/App.module.css"

const TitleImage = ({ user, svg, text }) => {
  return (
    <div className={styles.headerDiv}>
      <h1 className={styles.mainTitle}>{user}'s Todo List</h1>
      <img src={svg} alt={text} className={styles.todoListImage} />
    </div>
  )
}

TitleImage.propTypes = {
  user: PropTypes.string,
  svg: PropTypes.string,
  text: PropTypes.string
}

export default TitleImage;
