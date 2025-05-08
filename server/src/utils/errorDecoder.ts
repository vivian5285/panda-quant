import { ethers } from 'ethers';

/**
 * 解码智能合约错误信息
 * @param errorData 错误数据（0x开头的十六进制字符串）
 * @returns 解码后的错误信息
 */
export function decodeContractError(errorData: string): string {
    try {
        // 检查是否是标准的 Error(string) 错误
        if (errorData.startsWith('0x08c379a0')) {
            const iface = new ethers.utils.Interface(['function Error(string)']);
            const decoded = iface.parseError(errorData);
            return decoded.args[0];
        }
        
        // 检查是否是自定义错误
        if (errorData.startsWith('0x4e487b71')) {
            const iface = new ethers.utils.Interface(['function Panic(uint256)']);
            const decoded = iface.parseError(errorData);
            const panicCode = decoded.args[0];
            
            // 解析常见的 Panic 错误码
            const panicMessages: { [key: string]: string } = {
                '0x01': 'Assertion failed',
                '0x11': 'Arithmetic overflow/underflow',
                '0x12': 'Division by zero',
                '0x21': 'Enum conversion out of bounds',
                '0x22': 'Incorrectly encoded storage byte array',
                '0x31': 'Pop on empty array',
                '0x32': 'Array index out of bounds',
                '0x41': 'Out of memory',
                '0x51': 'Uninitialized function'
            };
            
            return panicMessages[panicCode] || `Unknown panic code: ${panicCode}`;
        }
        
        return 'Unknown error format';
    } catch (error) {
        console.error('Error decoding contract error:', error);
        return 'Failed to decode error message';
    }
}

/**
 * 处理智能合约错误响应
 * @param error 错误对象
 * @returns 处理后的错误信息
 */
export function handleContractError(error: any): string {
    if (error.data) {
        return decodeContractError(error.data);
    }
    
    if (error.message) {
        return error.message;
    }
    
    return 'Unknown error occurred';
} 