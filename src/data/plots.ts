export type PlotStatus = 'Available' | 'Reserved' | 'Sold';
export type PlotSize = '5 Marla' | '7 Marla' | '10 Marla' | '1 Kanal';

export interface PlotData {
  id: string;
  block: 'Block A' | 'Block B' | 'Block C';
  plotNumber: string;
  size: PlotSize;
  dimensions: string;
  status: PlotStatus;
  priceSample: string;
  priceNumeric: number;
  facing: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export const TOWNSHIP_PLOTS: PlotData[] = [
  // BLOCK A (1 Kanal & 10 Marla Executive Boulevard)
  { id: 'A-01', block: 'Block A', plotNumber: 'A-01', size: '1 Kanal', dimensions: "50' × 90'", status: 'Available', priceSample: 'PKR 2.85 Crore', priceNumeric: 28500000, facing: 'Main 80ft Boulevard', x: 50, y: 70, width: 85, height: 60 },
  { id: 'A-02', block: 'Block A', plotNumber: 'A-02', size: '1 Kanal', dimensions: "50' × 90'", status: 'Sold', priceSample: 'PKR 2.85 Crore', priceNumeric: 28500000, facing: 'North Boulevard', x: 145, y: 70, width: 85, height: 60 },
  { id: 'A-03', block: 'Block A', plotNumber: 'A-03', size: '1 Kanal', dimensions: "50' × 90'", status: 'Available', priceSample: 'PKR 2.95 Crore', priceNumeric: 29500000, facing: 'Corner North', x: 240, y: 70, width: 85, height: 60 },
  { id: 'A-04', block: 'Block A', plotNumber: 'A-04', size: '10 Marla', dimensions: "35' × 65'", status: 'Reserved', priceSample: 'PKR 1.45 Crore', priceNumeric: 14500000, facing: 'Avenue 1', x: 50, y: 140, width: 65, height: 50 },
  { id: 'A-05', block: 'Block A', plotNumber: 'A-05', size: '10 Marla', dimensions: "35' × 65'", status: 'Available', priceSample: 'PKR 1.45 Crore', priceNumeric: 14500000, facing: 'Avenue 1', x: 125, y: 140, width: 65, height: 50 },
  { id: 'A-06', block: 'Block A', plotNumber: 'A-06', size: '10 Marla', dimensions: "35' × 65'", status: 'Sold', priceSample: 'PKR 1.45 Crore', priceNumeric: 14500000, facing: 'Avenue 1', x: 200, y: 140, width: 65, height: 50 },
  { id: 'A-07', block: 'Block A', plotNumber: 'A-07', size: '10 Marla', dimensions: "35' × 65'", status: 'Available', priceSample: 'PKR 1.55 Crore', priceNumeric: 15500000, facing: 'Corner East', x: 275, y: 140, width: 65, height: 50 },
  { id: 'A-08', block: 'Block A', plotNumber: 'A-08', size: '10 Marla', dimensions: "35' × 65'", status: 'Reserved', priceSample: 'PKR 1.45 Crore', priceNumeric: 14500000, facing: 'Avenue 2', x: 50, y: 200, width: 65, height: 50 },
  { id: 'A-09', block: 'Block A', plotNumber: 'A-09', size: '10 Marla', dimensions: "35' × 65'", status: 'Available', priceSample: 'PKR 1.45 Crore', priceNumeric: 14500000, facing: 'Avenue 2', x: 125, y: 200, width: 65, height: 50 },
  { id: 'A-10', block: 'Block A', plotNumber: 'A-10', size: '10 Marla', dimensions: "35' × 65'", status: 'Sold', priceSample: 'PKR 1.45 Crore', priceNumeric: 14500000, facing: 'Avenue 2', x: 200, y: 200, width: 65, height: 50 },
  { id: 'A-11', block: 'Block A', plotNumber: 'A-11', size: '1 Kanal', dimensions: "50' × 90'", status: 'Available', priceSample: 'PKR 3.10 Crore', priceNumeric: 31000000, facing: 'Park Link East', x: 275, y: 200, width: 85, height: 50 },
  { id: 'A-12', block: 'Block A', plotNumber: 'A-12', size: '1 Kanal', dimensions: "50' × 90'", status: 'Sold', priceSample: 'PKR 3.10 Crore', priceNumeric: 31000000, facing: 'East Gate', x: 370, y: 200, width: 85, height: 50 },

  // BLOCK B (Park Facing & 7/10 Marla Enclave)
  { id: 'B-01', block: 'Block B', plotNumber: 'B-01', size: '10 Marla', dimensions: "35' × 65'", status: 'Available', priceSample: 'PKR 1.65 Crore', priceNumeric: 16500000, facing: 'Direct Park View', x: 530, y: 70, width: 70, height: 55 },
  { id: 'B-02', block: 'Block B', plotNumber: 'B-02', size: '10 Marla', dimensions: "35' × 65'", status: 'Sold', priceSample: 'PKR 1.65 Crore', priceNumeric: 16500000, facing: 'Direct Park View', x: 610, y: 70, width: 70, height: 55 },
  { id: 'B-03', block: 'Block B', plotNumber: 'B-03', size: '10 Marla', dimensions: "35' × 65'", status: 'Available', priceSample: 'PKR 1.75 Crore', priceNumeric: 17500000, facing: 'Park Corner', x: 690, y: 70, width: 70, height: 55 },
  { id: 'B-04', block: 'Block B', plotNumber: 'B-04', size: '7 Marla', dimensions: "30' × 52'", status: 'Available', priceSample: 'PKR 98 Lakh', priceNumeric: 9800000, facing: 'Greenway 1', x: 770, y: 70, width: 60, height: 55 },
  { id: 'B-05', block: 'Block B', plotNumber: 'B-05', size: '7 Marla', dimensions: "30' × 52'", status: 'Reserved', priceSample: 'PKR 98 Lakh', priceNumeric: 9800000, facing: 'Greenway 1', x: 530, y: 135, width: 60, height: 50 },
  { id: 'B-06', block: 'Block B', plotNumber: 'B-06', size: '7 Marla', dimensions: "30' × 52'", status: 'Sold', priceSample: 'PKR 98 Lakh', priceNumeric: 9800000, facing: 'Greenway 1', x: 600, y: 135, width: 60, height: 50 },
  { id: 'B-07', block: 'Block B', plotNumber: 'B-07', size: '7 Marla', dimensions: "30' × 52'", status: 'Available', priceSample: 'PKR 1.05 Crore', priceNumeric: 10500000, facing: 'Corner Greenway', x: 670, y: 135, width: 60, height: 50 },
  { id: 'B-08', block: 'Block B', plotNumber: 'B-08', size: '10 Marla', dimensions: "35' × 65'", status: 'Available', priceSample: 'PKR 1.60 Crore', priceNumeric: 16000000, facing: 'Central Promenade', x: 740, y: 135, width: 70, height: 50 },
  { id: 'B-09', block: 'Block B', plotNumber: 'B-09', size: '7 Marla', dimensions: "30' × 52'", status: 'Sold', priceSample: 'PKR 98 Lakh', priceNumeric: 9800000, facing: 'Park Lane 2', x: 530, y: 195, width: 60, height: 50 },
  { id: 'B-10', block: 'Block B', plotNumber: 'B-10', size: '7 Marla', dimensions: "30' × 52'", status: 'Available', priceSample: 'PKR 98 Lakh', priceNumeric: 9800000, facing: 'Park Lane 2', x: 600, y: 195, width: 60, height: 50 },
  { id: 'B-11', block: 'Block B', plotNumber: 'B-11', size: '10 Marla', dimensions: "35' × 65'", status: 'Reserved', priceSample: 'PKR 1.60 Crore', priceNumeric: 16000000, facing: 'Promenade West', x: 670, y: 195, width: 70, height: 50 },
  { id: 'B-12', block: 'Block B', plotNumber: 'B-12', size: '10 Marla', dimensions: "35' × 65'", status: 'Sold', priceSample: 'PKR 1.70 Crore', priceNumeric: 17000000, facing: 'Park Corner West', x: 750, y: 195, width: 70, height: 50 },

  // BLOCK C (5 Marla & 7 Marla Fast-Growth Enclave)
  { id: 'C-01', block: 'Block C', plotNumber: 'C-01', size: '5 Marla', dimensions: "25' × 45'", status: 'Available', priceSample: 'PKR 52 Lakh', priceNumeric: 5200000, facing: 'South Boulevard 60ft', x: 50, y: 310, width: 55, height: 48 },
  { id: 'C-02', block: 'Block C', plotNumber: 'C-02', size: '5 Marla', dimensions: "25' × 45'", status: 'Available', priceSample: 'PKR 52 Lakh', priceNumeric: 5200000, facing: 'South Boulevard 60ft', x: 115, y: 310, width: 55, height: 48 },
  { id: 'C-03', block: 'Block C', plotNumber: 'C-03', size: '5 Marla', dimensions: "25' × 45'", status: 'Sold', priceSample: 'PKR 52 Lakh', priceNumeric: 5200000, facing: 'South Boulevard 60ft', x: 180, y: 310, width: 55, height: 48 },
  { id: 'C-04', block: 'Block C', plotNumber: 'C-04', size: '7 Marla', dimensions: "30' × 52'", status: 'Available', priceSample: 'PKR 82 Lakh', priceNumeric: 8200000, facing: 'Boulevard Corner', x: 245, y: 310, width: 65, height: 48 },
  { id: 'C-05', block: 'Block C', plotNumber: 'C-05', size: '5 Marla', dimensions: "25' × 45'", status: 'Reserved', priceSample: 'PKR 48 Lakh', priceNumeric: 4800000, facing: 'Street 4', x: 50, y: 370, width: 55, height: 48 },
  { id: 'C-06', block: 'Block C', plotNumber: 'C-06', size: '5 Marla', dimensions: "25' × 45'", status: 'Sold', priceSample: 'PKR 48 Lakh', priceNumeric: 4800000, facing: 'Street 4', x: 115, y: 370, width: 55, height: 48 },
  { id: 'C-07', block: 'Block C', plotNumber: 'C-07', size: '5 Marla', dimensions: "25' × 45'", status: 'Available', priceSample: 'PKR 48 Lakh', priceNumeric: 4800000, facing: 'Street 4', x: 180, y: 370, width: 55, height: 48 },
  { id: 'C-08', block: 'Block C', plotNumber: 'C-08', size: '7 Marla', dimensions: "30' × 52'", status: 'Available', priceSample: 'PKR 82 Lakh', priceNumeric: 8200000, facing: 'Civic Center Walk', x: 245, y: 370, width: 65, height: 48 },
  { id: 'C-09', block: 'Block C', plotNumber: 'C-09', size: '5 Marla', dimensions: "25' × 45'", status: 'Sold', priceSample: 'PKR 48 Lakh', priceNumeric: 4800000, facing: 'Street 5', x: 50, y: 430, width: 55, height: 48 },
  { id: 'C-10', block: 'Block C', plotNumber: 'C-10', size: '5 Marla', dimensions: "25' × 45'", status: 'Available', priceSample: 'PKR 48 Lakh', priceNumeric: 4800000, facing: 'Street 5', x: 115, y: 430, width: 55, height: 48 },
  { id: 'C-11', block: 'Block C', plotNumber: 'C-11', size: '7 Marla', dimensions: "30' × 52'", status: 'Reserved', priceSample: 'PKR 85 Lakh', priceNumeric: 8500000, facing: 'South Gate Corner', x: 180, y: 430, width: 65, height: 48 },
  { id: 'C-12', block: 'Block C', plotNumber: 'C-12', size: '7 Marla', dimensions: "30' × 52'", status: 'Available', priceSample: 'PKR 85 Lakh', priceNumeric: 8500000, facing: 'Main Entrance Corridor', x: 255, y: 430, width: 65, height: 48 },
];
