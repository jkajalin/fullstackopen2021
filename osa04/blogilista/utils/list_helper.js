
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  var total = blogs.reduce((sum, blogitem) => sum + blogitem.likes, 0)
  console.log(total)
  return total
}

module.exports = {
  dummy, totalLikes
}