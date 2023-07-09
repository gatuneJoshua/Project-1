




var firstSeatLabel = 1;
var booked = !!localStorage.getItem('booked') ? $.parseJSON(localStorage.getItem('booked')) : [];
$(document).ready(function() {
    var $cart = $('#selected-seats'),
        $counter = $('#counter'),
        $total = $('#total'),
        sc = $('#bus-seat-map').seatCharts({
            map: [
                'ff_ff',
                'ff_ff',
                'ee_ee',
                'ee_ee',
                'ee___',
                'ee_ee',
                'ee_ee',
                'ee_ee',
                'eeeee',
            ],
            seats: {
                f: {
                    price: 50,
                    classes: 'members-only', 
                    category: 'Members Only'
                },
                e: {
                    price: 80,
                    classes: 'economy-class',
                    category: 'Economy Class'
                }

            },
            naming: {
                top: false,
                getLabel: function(character, row, column) {
                    return firstSeatLabel++;
                },
            },
            legend: {
                node: $('#legend'),
                items: [
                    ['f', 'available', 'Members Only'],
                    ['e', 'available', 'Economy Class'],
                    ['f', 'unavailable', 'Already Booked']
                ]
            },
            click: function() {
                if (this.status() == 'available') {
                    //create a list to add to cart items
                    $('<li>' + this.data().category + ' Seat # ' + this.settings.label + ': <b>$' + this.data().price + '</b> <a href="#" class="cancel-cart-item">[cancel]</a></li>')
                        .attr('id', 'cart-item-' + this.settings.id)
                        .data('seatId', this.settings.id)
                        .appendTo($cart);

                    //Lets update the counter
                    //add 1 to the length and the current seat price to the total. 
                    $counter.text(sc.find('selected').length + 1);
                    $total.text(recalculateTotal(sc) + this.data().price);

                    return 'selected';

                } else if (this.status() == 'selected') {

                    //update the counter
                    $counter.text(sc.find('selected').length - 1);

                    //total
                    $total.text(recalculateTotal(sc) - this.data().price);

                    //remove  item from  cart
                    $('#cart-item-' + this.settings.id).remove();

                    //vacant seats
                    return 'available';

                } else if (this.status() == 'unavailable') {
                    //booked seats
                    return 'unavailable';
                } else {
                    return this.style();
                }
            }
        });

    //cancel function
    $('#selected-seats').on('click', '.cancel-cart-item', function() {
        //click function on appropriate seats
        sc.get($(this).parents('li:first').data('seatId')).click();
    });

   //after booked
    sc.get(booked).status('unavailable');

});

function recalculateTotal(sc) {
    var total = 0;

    //sum the price of every selected seats
    sc.find('selected').each(function() {

        total += this.data().price;

    });

    return total;
}

$(function() {
    $('#submit-button').click(function() {
        var items = $('#booked-seats li')
        if (items.length <= 0) {
            alert("Welcome! Successfully Booked. Book Ten trips for a discount-redeamable Point!")
            return false;
        }
        var selected = [];
        items.each(function(e) {
            var id = $(this).attr('id')
            id = id.replace("cart-item-")
            selected.push(id)
        })
       
        localStorage.setItem('booked', JSON.stringify(selected))
        alert("Welcome! Successfully Booked. Book Ten trips for a discount-redeamable Point!")
        location.reload()
    })
    $('#reset-btn').click(function() {
        if (confirm("do you want to reset the Booking of the bus?") === true) {
            localStorage.removeItem('booked')
            alert("Reset successfull.")
            location.reload()
        }
    })
    
})



// LINKING HTML pages
// function clickData (){
//     console.log("")
//     window.location.href = "providers.html";
// }


