
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  var total = blogs.reduce((sum, blogitem) => sum + blogitem.likes, 0)
  console.log(total)
  return total
}

const favouriteBlog = (blogs) => {
  var mostlikedItem = blogs.reduce((previousItem, blogitem) => {
    let mostLiked = previousItem
    if( blogitem.likes >= mostLiked.likes){
      mostLiked=blogitem
    }
    return mostLiked
  })
  console.log(mostlikedItem)
  return mostlikedItem
}

module.exports = {
  dummy, totalLikes, favouriteBlog
}