<?php
// ================= PROCESS FORM =================
$showBilling = false;

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    if (empty($_POST['capacity'])) die("No selected room capacity");
    if (empty($_POST['room_type'])) die("No selected room type");
    if (empty($_POST['payment'])) die("No selected type of payment");

    $customer = $_POST['customer'];
    $contact  = $_POST['contact'];
    $from     = $_POST['from'];
    $to       = $_POST['to'];
    $roomType = $_POST['room_type'];
    $capacity = $_POST['capacity'];
    $payment  = trim($_POST['payment']);

    $days = (strtotime($to) - strtotime($from)) / 86400;
    if ($days <= 0) die("Invalid reservation dates");

    $rates = [
        'Single' => ['Regular'=>100, 'Deluxe'=>300, 'Suite'=>500],
        'Double' => ['Regular'=>200, 'Deluxe'=>500, 'Suite'=>800],
        'Family' => ['Regular'=>500, 'Deluxe'=>750, 'Suite'=>1000]
    ];

    $ratePerDay = $rates[$capacity][$roomType];
    $subtotal   = $ratePerDay * $days;

    $discountRate = 0;
    $chargeRate   = 0;
    $discountAmt  = 0;
    $chargeAmt    = 0;

    if (strcasecmp($payment, "Cash") === 0) {
        if ($days >= 6)      $discountRate = 0.15;
        elseif ($days >= 3)  $discountRate = 0.10;

        $discountAmt = $subtotal * $discountRate;
        $total = $subtotal - $discountAmt;

    } elseif (strcasecmp($payment, "Check") === 0) {
        $chargeRate = 0.05;
        $chargeAmt  = $subtotal * $chargeRate;
        $total = $subtotal + $chargeAmt;

    } else {
        $chargeRate = 0.10;
        $chargeAmt  = $subtotal * $chargeRate;
        $total = $subtotal + $chargeAmt;
    }

    $showBilling = true;
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>HACHU’S SEASIDE CABIN | Seaside Cabin Reservation</title>
    <style>
        body {
            margin: 0;
            font-family: Arial, Helvetica, sans-serif;
            background: #eaf6fb;
        }
        .container {
            width: 1000px;
            margin: 20px auto;
            background: #ffffff;
            border: 2px solid #5faad1;
        }
        .header {
            text-align: center;
            padding: 20px;
            border-bottom: 2px solid #5faad1;
            background: #eef9ff;
        }
        .header h1 {
            margin: 0;
            color: #2c6f91;
        }
        .header h2 {
            margin: 5px 0 0;
            font-weight: normal;
        }
        .content {
            padding: 20px;
        }
        .section-title {
            border-bottom: 2px solid #5faad1;
            margin-bottom: 15px;
            padding-bottom: 5px;
            font-weight: bold;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        td, th {
            padding: 8px;
            border: 1px solid #5faad1;
        }
        th {
            background: #d9eef9;
            text-align: left;
        }
        .actions {
            text-align: center;
            margin-top: 15px;
        }
        button {
            padding: 6px 15px;
            font-weight: bold;
        }
    </style>
</head>
<body>

<div class="container">

<div class="header">
    <h1>HACHU’S SEASIDE CABIN</h1>
    <h2>ONLINE RESERVATION</h2>
</div>

<div class="content">

<?php if (!$showBilling): ?>

<div class="section-title">Reservation Form</div>

<form method="post">
<table>
<tr><td>Customer Name</td><td><input type="text" name="customer" required></td></tr>
<tr><td>Contact Number</td><td><input type="text" name="contact" required></td></tr>
<tr><td>Date From</td><td><input type="date" name="from" required></td></tr>
<tr><td>Date To</td><td><input type="date" name="to" required></td></tr>

<tr>
<td>Room Type</td>
<td>
    <input type="radio" name="room_type" value="Regular"> Regular
    <input type="radio" name="room_type" value="Deluxe"> Deluxe
    <input type="radio" name="room_type" value="Suite"> Suite
</td>
</tr>

<tr>
<td>Room Capacity</td>
<td>
    <input type="radio" name="capacity" value="Single"> Single
    <input type="radio" name="capacity" value="Double"> Double
    <input type="radio" name="capacity" value="Family"> Family
</td>
</tr>

<tr>
<td>Payment Type</td>
<td>
    <input type="radio" name="payment" value="Cash"> Cash
    <input type="radio" name="payment" value="Check"> Check
    <input type="radio" name="payment" value="Credit Card"> Credit Card
</td>
</tr>
</table>

<div class="actions">
    <button type="submit">Submit Reservation</button>
</div>
</form>

<?php else: ?>

<div class="section-title">Reservation: Billing Information</div>

<p>
Enjoy our 10% discount for 3–5 days of reservation or <br>
Enjoy our 15% discount for 6 days or above of reservation
</p>

<table>
<tr><th colspan="2">Customer Information</th></tr>
<tr><td>Customer Name</td><td><?= $customer ?></td></tr>
<tr><td>Contact Number</td><td><?= $contact ?></td></tr>
<tr><td>Reservation Dates</td><td><?= $from ?> to <?= $to ?></td></tr>
<tr><td>Room Type</td><td><?= $roomType ?></td></tr>
<tr><td>Room Capacity</td><td><?= $capacity ?></td></tr>
<tr><td>Payment Type</td><td><?= $payment ?></td></tr>
</table>

<br>

<table>
<tr><th colspan="2">BILLING STATEMENTS</th></tr>
<tr><td>No. of Days</td><td><?= $days ?></td></tr>
<tr><td>Rate / Day</td><td><?= number_format($ratePerDay,2) ?></td></tr>
<tr><td>Sub-Total</td><td><?= number_format($subtotal,2) ?></td></tr>

<?php if (strcasecmp($payment, "Cash") === 0): ?>
<tr><td>Discount (<?= $discountRate*100 ?>%)</td><td>- <?= number_format($discountAmt,2) ?></td></tr>
<?php else: ?>
<tr><td>Additional Charge (<?= $chargeRate*100 ?>%)</td><td>+ <?= number_format($chargeAmt,2) ?></td></tr>
<?php endif; ?>

<tr><th>Total Bill</th><th><?= number_format($total,2) ?></th></tr>
</table>

<div class="actions">
    <a href="ReservationMagpantayOgoc.php">Back</a>
</div>

<?php endif; ?>

</div>
</div>

</body>
</html>
