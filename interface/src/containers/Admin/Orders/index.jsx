import { useEffect, useState } from 'react';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { api } from '../../../services/api';
import { orderStatusOptions } from './orderStatus';
import { Row } from './row';
import { FilterOption, Filter } from './styles';

function createData(order) {
  return {
    name: order.user.name,
    orderId: order._id,
    date: order.createdAt,
    status: order.status,
    products: order.products,
  };
}

export function Orders() {
  const [orders, setOrders] = useState([]);
  const [activeStatus, setActiveStatus] = useState(0);

  useEffect(() => {
    async function loadOrders() {
      const { data } = await api.get('orders');

      setOrders(data);
    }

    loadOrders();
  }, []);

  const activeOption = orderStatusOptions.find(
    (option) => option.id === activeStatus,
  );

  const filteredOrders =
    activeStatus === 0
      ? orders
      : orders.filter((order) => order.status === activeOption?.value);

  const rows = filteredOrders.map((order) => createData(order));

  return (
    <>
      <Filter>
        {orderStatusOptions.map((status) => (
          <FilterOption
            key={status.id}
            onClick={() => setActiveStatus(status.id)}
            $isActiveStatus={activeStatus === status.id}
          >
            {status.label}
          </FilterOption>
        ))}
      </Filter>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Pedido</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Data do Pedido</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <Row
                key={row.orderId}
                row={row}
                orders={orders}
                setOrders={setOrders}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
