import { Types } from 'mongoose';
import { OrderBook } from '../models/OrderBook.model';
import { IOrderBook, IOrderBookDocument, OrderBookCreateInput, OrderBookUpdateInput } from '../types/OrderBook';
import { logger } from '../utils/Logger';

export class OrderBookService {
  private static instance: OrderBookService;

  private constructor() {}

  public static getInstance(): OrderBookService {
    if (!OrderBookService.instance) {
      OrderBookService.instance = new OrderBookService();
    }
    return OrderBookService.instance;
  }

  private convertToIOrderBook(orderBook: IOrderBookDocument): IOrderBook {
    return {
      _id: orderBook._id,
      exchange: orderBook.exchange,
      symbol: orderBook.symbol,
      bids: orderBook.bids,
      asks: orderBook.asks,
      timestamp: orderBook.timestamp
    };
  }

  async createOrderBook(orderBookData: OrderBookCreateInput): Promise<IOrderBook> {
    try {
      const orderBook = new OrderBook(orderBookData);
      const savedOrderBook = await orderBook.save();
      return this.convertToIOrderBook(savedOrderBook);
    } catch (error) {
      logger.error('Error creating order book:', error);
      throw error;
    }
  }

  async getOrderBookById(id: string): Promise<IOrderBook | null> {
    try {
      const orderBook = await OrderBook.findById(id);
      return orderBook ? this.convertToIOrderBook(orderBook) : null;
    } catch (error) {
      logger.error('Error getting order book:', error);
      throw error;
    }
  }

  async getOrderBookBySymbol(symbol: string): Promise<IOrderBook | null> {
    try {
      const orderBook = await OrderBook.findOne({ symbol });
      return orderBook ? this.convertToIOrderBook(orderBook) : null;
    } catch (error) {
      logger.error('Error getting order book by symbol:', error);
      throw error;
    }
  }

  async updateOrderBook(id: string, data: OrderBookUpdateInput): Promise<IOrderBook | null> {
    try {
      const orderBook = await OrderBook.findByIdAndUpdate(id, data, { new: true });
      return orderBook ? this.convertToIOrderBook(orderBook) : null;
    } catch (error) {
      logger.error('Error updating order book:', error);
      throw error;
    }
  }

  async deleteOrderBook(id: string): Promise<boolean> {
    try {
      const result = await OrderBook.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      logger.error('Error deleting order book:', error);
      throw error;
    }
  }
} 