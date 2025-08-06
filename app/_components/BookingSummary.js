'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";

export default function BookingSummary() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [pageIndex, setPageIndex] = useState(0);
  const [sorting, setSorting] = useState([]);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // For now, we'll use sessionStorage to get booking data
    // In a real app, this would be an API call
    async function fetchData() {
      setLoading(true);
      
      try {
        // Get booking data from sessionStorage
        const bookingData = sessionStorage.getItem('bookingData');
        let bookingsList = [];
        
        if (bookingData) {
          try {
            const parsed = JSON.parse(bookingData);
            // Convert to array format for table
            bookingsList = [{
              id: '1',
              pickupDate: parsed.pickupDate || 'N/A',
              returnDate: parsed.returnDate || 'N/A',
              vehicle: parsed.selectedVehicle || 'N/A',
              hub: parsed.selectedHub || 'N/A',
              confirmed: parsed.confirmed || false,
              userDetails: parsed.userDetails
            }];
          } catch (error) {
            console.error('Error parsing booking data:', error);
          }
        }
        
        setBookings(bookingsList);
        setTotalPages(Math.ceil(bookingsList.length / 10));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setLoading(false);
      }
    }
    
    fetchData();
  }, [isAuthenticated, router]);

  const columns = useMemo(() => [
    { accessorKey: 'id', header: 'Booking ID' },
    { accessorKey: 'pickupDate', header: 'Pickup Date' },
    { accessorKey: 'returnDate', header: 'Return Date' },
    { accessorKey: 'vehicle', header: 'Vehicle' },
    { accessorKey: 'hub', header: 'Pickup Location' },
    {
      id: 'confirmed',
      header: 'Status',
      cell: info => (
        <span className={`badge ${info.getValue() ? 'bg-success' : 'bg-warning'}`}>
          {info.getValue() ? 'Confirmed' : 'Pending'}
        </span>
      )
    },
  ], []);

  const table = useReactTable({
    data: bookings,
    columns,
    state: { pagination: { pageIndex, pageSize: 10 }, sorting },
    onSortingChange: setSorting,
    manualPagination: true,
    pageCount: totalPages,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel()
  });

  if (!isAuthenticated) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="card shadow-lg border-0 rounded-4">
                <div className="card-body p-5 text-center">
                  <div className="mb-4">
                    <i className="bi bi-shield-lock text-warning" style={{ fontSize: '4rem' }}></i>
                  </div>
                  <h2 className="h3 fw-bold text-dark mb-3">Authentication Required</h2>
                  <p className="text-muted mb-4">Please log in to view your booking history.</p>
                  <button 
                    onClick={() => router.push('/auth/login')}
                    className="btn btn-primary btn-lg px-5 py-3 fw-bold"
                  >
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Go to Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="card shadow-lg border-0 rounded-4">
                <div className="card-body p-5 text-center">
                  <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="text-muted mb-0">Loading your booking history...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            {/* Header */}
            <div className="text-center mb-5">
              <h1 className="h2 fw-bold text-dark mb-2">
                <i className="bi bi-clock-history text-primary me-2"></i>
                Booking History
              </h1>
              <p className="text-muted mb-0">Welcome back, {user?.firstName || user?.email}</p>
            </div>

            {bookings.length === 0 ? (
              <div className="card shadow-lg border-0 rounded-4">
                <div className="card-body p-5 text-center">
                  <div className="mb-4">
                    <i className="bi bi-calendar-x text-muted" style={{ fontSize: '4rem' }}></i>
                  </div>
                  <h2 className="h3 fw-bold text-dark mb-3">No Booking History</h2>
                  <p className="text-muted mb-4">You don't have any booking history yet.</p>
                  <button 
                    onClick={() => router.push('/')}
                    className="btn btn-primary btn-lg px-5 py-3 fw-bold"
                  >
                    <i className="bi bi-car-front me-2"></i>
                    Book a Car
                  </button>
                </div>
              </div>
            ) : (
              <div className="card shadow-lg border-0 rounded-4">
                <div className="card-body p-4">
                  <div className="overflow-x-auto rounded-md border">
                    <Table>
                      <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => (
                          <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                              <TableHead
                                key={header.id}
                                className="cursor-pointer"
                                onClick={header.column.getToggleSortingHandler()}
                              >
                                {header.isPlaceholder ? null : header.column.columnDef.header}
                                <span>
                                  {{
                                    asc: ' 🔼',
                                    desc: ' 🔽'
                                  }[header.column.getIsSorted()] ?? null}
                                </span>
                              </TableHead>
                            ))}
                          </TableRow>
                        ))}
                      </TableHeader>
                      <TableBody>
                        {table.getRowModel().rows.length ? (
                          table.getRowModel().rows.map(row => (
                            <TableRow key={row.id}>
                              {row.getVisibleCells().map(cell => (
                                <TableCell key={cell.id}>
                                  {cell.renderCell()}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={columns.length} className="text-center py-8">
                              No bookings found.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="d-flex align-items-center justify-content-between py-4">
                    <Button
                      variant="outline"
                      onClick={() => setPageIndex(old => Math.max(old - 1, 0))}
                      disabled={!table.getCanPreviousPage()}
                    >
                      Previous
                    </Button>
                    <span className="text-sm">
                      Page {pageIndex + 1} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => setPageIndex(old => old + 1)}
                      disabled={!table.getCanNextPage()}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
