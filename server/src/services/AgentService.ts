import { Types } from 'mongoose';
import { Agent } from '../models/Agent.model';
import { IAgent, IAgentDocument, IAgentCreateInput, IAgentUpdateInput } from '../types/Agent';
import { logger } from '../utils/Logger';
import { AppError } from '../utils/AppError';

export class AgentService {
  private static instance: AgentService;

  private constructor() {}

  public static getInstance(): AgentService {
    if (!AgentService.instance) {
      AgentService.instance = new AgentService();
    }
    return AgentService.instance;
  }

  private convertToIAgent(agent: IAgentDocument): IAgent {
    return {
      _id: agent._id,
      userId: agent.userId,
      name: agent.name,
      type: agent.type,
      status: agent.status,
      config: agent.config,
      createdAt: agent.createdAt,
      updatedAt: agent.updatedAt
    };
  }

  async createAgent(data: IAgentCreateInput): Promise<IAgent> {
    try {
      const agent = new Agent(data);
      const savedAgent = await agent.save();
      return this.convertToIAgent(savedAgent);
    } catch (error) {
      logger.error('Error creating agent:', error);
      throw new AppError('Failed to create agent', 500);
    }
  }

  async getAgentById(id: string): Promise<IAgent | null> {
    try {
      const agent = await Agent.findById(id);
      return agent ? this.convertToIAgent(agent) : null;
    } catch (error) {
      logger.error('Error getting agent:', error);
      throw new AppError('Failed to get agent', 500);
    }
  }

  async getAgentsByUserId(userId: string): Promise<IAgent[]> {
    try {
      const agents = await Agent.find({ userId: new Types.ObjectId(userId) });
      return agents.map(agent => this.convertToIAgent(agent));
    } catch (error) {
      logger.error('Error getting agents by user id:', error);
      throw new AppError('Failed to get agents', 500);
    }
  }

  async updateAgent(id: string, data: IAgentUpdateInput): Promise<IAgent | null> {
    try {
      const agent = await Agent.findByIdAndUpdate(id, data, { new: true });
      return agent ? this.convertToIAgent(agent) : null;
    } catch (error) {
      logger.error('Error updating agent:', error);
      throw new AppError('Failed to update agent', 500);
    }
  }

  async deleteAgent(id: string): Promise<boolean> {
    try {
      const result = await Agent.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      logger.error('Error deleting agent:', error);
      throw new AppError('Failed to delete agent', 500);
    }
  }

  async updateAgentStatus(id: string, status: string): Promise<IAgent | null> {
    try {
      const agent = await Agent.findByIdAndUpdate(
        id,
        { status, updatedAt: new Date() },
        { new: true }
      );
      return agent ? this.convertToIAgent(agent) : null;
    } catch (error) {
      logger.error('Error updating agent status:', error);
      throw new AppError('Failed to update agent status', 500);
    }
  }
} 