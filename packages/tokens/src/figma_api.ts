import type { GetLocalVariablesResponse } from '@figma/rest-api-spec';

export default class FigmaApi {
  private baseUrl = 'https://api.figma.com';
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  async getLocalVariables(fileKey: string): Promise<GetLocalVariablesResponse> {
    const response = await fetch(`${this.baseUrl}/v1/files/${fileKey}/variables/local`, {
      method: 'GET',
      headers: {
        Accept: '*/*',
        'X-Figma-Token': this.token,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching local variables: ${response.statusText}`);
    }

    const data: GetLocalVariablesResponse = await response.json();
    return data;
  }
}
