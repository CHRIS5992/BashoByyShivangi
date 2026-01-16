import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

/**
 * Custom hook to fetch user's order history from SQLite/Django backend
 * Orders are fetched and sorted by creation date (newest first)
 */
export const useOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currentUser, loading: authLoading } = useAuth();

    useEffect(() => {
        // Wait for auth to finish loading
        if (authLoading) {
            return;
        }

        // If no user is logged in, return empty
        if (!currentUser) {
            setOrders([]);
            setLoading(false);
            return;
        }

        const fetchOrders = async () => {
            setLoading(true);
            setError(null);

            try {
                // Fetch orders from Django API filtered by Firebase UID
                const response = await fetch(`/api/orders/?firebase_uid=${currentUser.uid}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch order history from server');
                }

                const data = await response.json();

                // Transform Django data to match our UI expectations
                const ordersData = data.map((order) => ({
                    orderId: order.order_number,
                    id: order.id,
                    items: order.items.map(item => ({
                        name: item.product_name,
                        price: item.product_price,
                        quantity: item.quantity,
                        image: item.product_image // The serializer provides this
                    })),
                    totalAmount: parseFloat(order.total_amount),
                    status: order.status,
                    createdAt: new Date(order.created_at),
                    paymentMethod: order.payment_method,
                    paymentStatus: order.payment_status
                }));

                setOrders(ordersData);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching orders from Django:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchOrders();
    }, [currentUser, authLoading]);

    return { orders, loading, error };
};

export default useOrders;
