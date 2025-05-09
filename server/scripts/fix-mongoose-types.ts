import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);

async function fixMongooseTypes() {
  const modelsDir = path.join(__dirname, '../src/models');
  const files = fs.readdirSync(modelsDir);

  for (const file of files) {
    if (!file.endsWith('.model.ts')) continue;

    const filePath = path.join(modelsDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');

    // 修复 Document 类型导入
    if (!content.includes('import { Document } from \'mongoose\'')) {
      content = content.replace(
        /import mongoose, { Schema/g,
        'import mongoose, { Schema, Document, Types'
      );
    }

    // 修复 ObjectId 类型定义
    content = content.replace(
      /type: Types\.ObjectId/g,
      'type: Schema.Types.ObjectId'
    );

    // 修复 Schema 定义
    content = content.replace(
      /new Schema<([^>]+)>/g,
      'new Schema<$1, Document>'
    );

    // 修复接口继承
    content = content.replace(
      /extends Document/g,
      'extends Document<any, any, any>'
    );

    // 修复 _id 类型
    content = content.replace(
      /_id: Types\.ObjectId/g,
      '_id: Types.ObjectId'
    );

    // 修复 metadata 字段
    if (content.includes('metadata: { type: Schema.Types.Mixed')) {
      content = content.replace(
        /metadata: { type: Schema\.Types\.Mixed/g,
        'metadata: { type: Schema.Types.Mixed, default: {}'
      );
    }

    fs.writeFileSync(filePath, content);
    console.log(`Fixed ${file}`);
  }
}

fixMongooseTypes().catch(console.error); 