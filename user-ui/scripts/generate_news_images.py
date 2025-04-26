from PIL import Image, ImageDraw, ImageFont
import os
import sys

def create_funding_image():
    try:
        print("Creating funding image...")
        # 创建新图片
        img = Image.new('RGB', (800, 400), color=(26, 26, 26))
        draw = ImageDraw.Draw(img)
        
        # 绘制背景渐变
        for y in range(400):
            color = int(26 + (y/400) * 20)  # 从深灰到浅灰的渐变
            draw.line([(0, y), (800, y)], fill=(color, color, color))
        
        # 绘制上升的折线图
        points = [(100, 300), (200, 250), (300, 200), (400, 150), (500, 100), (600, 50)]
        draw.line(points, fill=(0, 255, 184), width=3)
        
        # 绘制数据点
        for point in points:
            draw.ellipse([point[0]-5, point[1]-5, point[0]+5, point[1]+5], 
                        fill=(0, 255, 184), outline=(255, 255, 255))
        
        # 确保目录存在
        output_dir = "C:/Users/Administrator/Desktop/panda-quant/user-ui/public/images/news"
        os.makedirs(output_dir, exist_ok=True)
        
        # 保存图片
        output_path = os.path.join(output_dir, 'funding.jpg')
        img.save(output_path)
        print(f"Funding image saved to: {output_path}")
    except Exception as e:
        print(f"Error creating funding image: {str(e)}")
        raise

def create_strategy_image():
    try:
        print("Creating strategy image...")
        # 创建新图片
        img = Image.new('RGB', (800, 400), color=(26, 26, 26))
        draw = ImageDraw.Draw(img)
        
        # 绘制背景网格
        for x in range(0, 800, 40):
            draw.line([(x, 0), (x, 400)], fill=(40, 40, 40))
        for y in range(0, 400, 40):
            draw.line([(0, y), (800, y)], fill=(40, 40, 40))
        
        # 绘制策略图标
        draw.rectangle([200, 100, 600, 300], outline=(0, 255, 184), width=3)
        draw.line([(300, 100), (500, 300)], fill=(0, 255, 184), width=3)
        draw.line([(500, 100), (300, 300)], fill=(0, 255, 184), width=3)
        
        # 保存图片
        output_dir = "C:/Users/Administrator/Desktop/panda-quant/user-ui/public/images/news"
        os.makedirs(output_dir, exist_ok=True)
        output_path = os.path.join(output_dir, 'strategy.jpg')
        img.save(output_path)
        print(f"Strategy image saved to: {output_path}")
    except Exception as e:
        print(f"Error creating strategy image: {str(e)}")
        raise

def create_partnership_image():
    try:
        print("Creating partnership image...")
        # 创建新图片
        img = Image.new('RGB', (800, 400), color=(26, 26, 26))
        draw = ImageDraw.Draw(img)
        
        # 绘制握手图标
        draw.ellipse([300, 100, 500, 300], outline=(0, 255, 184), width=3)
        draw.line([(350, 200), (450, 200)], fill=(0, 255, 184), width=3)
        draw.line([(350, 200), (300, 250)], fill=(0, 255, 184), width=3)
        draw.line([(450, 200), (500, 250)], fill=(0, 255, 184), width=3)
        
        # 保存图片
        output_dir = "C:/Users/Administrator/Desktop/panda-quant/user-ui/public/images/news"
        os.makedirs(output_dir, exist_ok=True)
        output_path = os.path.join(output_dir, 'partnership.jpg')
        img.save(output_path)
        print(f"Partnership image saved to: {output_path}")
    except Exception as e:
        print(f"Error creating partnership image: {str(e)}")
        raise

def create_users_image():
    try:
        print("Creating users image...")
        # 创建新图片
        img = Image.new('RGB', (800, 400), color=(26, 26, 26))
        draw = ImageDraw.Draw(img)
        
        # 绘制用户图标和数字
        draw.ellipse([300, 100, 500, 300], outline=(0, 255, 184), width=3)
        draw.text((350, 150), "100K", fill=(0, 255, 184))
        
        # 绘制增长箭头
        draw.polygon([(400, 50), (380, 80), (420, 80)], fill=(0, 255, 184))
        
        # 保存图片
        output_dir = "C:/Users/Administrator/Desktop/panda-quant/user-ui/public/images/news"
        os.makedirs(output_dir, exist_ok=True)
        output_path = os.path.join(output_dir, 'users.jpg')
        img.save(output_path)
        print(f"Users image saved to: {output_path}")
    except Exception as e:
        print(f"Error creating users image: {str(e)}")
        raise

if __name__ == '__main__':
    try:
        print("Starting image generation...")
        create_funding_image()
        create_strategy_image()
        create_partnership_image()
        create_users_image()
        print("All images generated successfully!")
    except Exception as e:
        print(f"Error in main: {str(e)}")
        sys.exit(1) 