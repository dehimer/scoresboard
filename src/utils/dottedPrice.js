export default (price) => (price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.'))
