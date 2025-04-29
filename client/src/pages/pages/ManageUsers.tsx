export default function ManageOrders() {
    return (
        <div className="manage-orders-container">
        <h1 className="manage-orders-title">Užsakymų valdymas</h1>
        <p className="manage-orders-description">
            Čia galite peržiūrėti ir valdyti visus užsakymus.
        </p>
        <div className="manage-orders-actions">
            <button className="manage-orders-button view-orders">Peržiūrėti užsakymus</button>
            <button className="manage-orders-button manage-orders">Valdyti užsakymus</button>
        </div>
        </div>
    );
    }