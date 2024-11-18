let carts = {};

const getCarts = () => carts;
const setCarts = (newCarts) => {
    carts = newCarts;
};

module.exports = { getCarts, setCarts };
