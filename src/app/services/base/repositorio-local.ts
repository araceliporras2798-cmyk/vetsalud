/** Toda entidad que se guarda en el navegador debe tener un id numérico. */
export interface Entidad {
  id: number;
}

/**
 * Clase base ABSTRACTA para los servicios de datos de VetSalud.
 *
 * Centraliza la lógica común (leer y escribir en localStorage, generar ids,
 * listar, actualizar y eliminar) para que cada servicio concreto solo defina
 * lo que lo hace distinto.
 *
 * POO aplicada:
 *  - Abstracción: no se puede instanciar; define el "contrato" de un repositorio.
 *  - Herencia: DuenoService, MascotaService, CitaService e HistorialService la extienden.
 *  - Polimorfismo: cada hijo sobrescribe `describir()` y los "ganchos" `validar()`
 *    y `validarEliminacion()`; la clase base los llama sin saber qué hijo es (patrón Template Method).
 *  - Encapsulamiento: los datos son privados y solo se entregan copias.
 *  - Genéricos: <T extends Entidad> reutiliza el mismo código para cualquier modelo.
 */
export abstract class RepositorioLocal<T extends Entidad> {
  /** Clave de localStorage donde se guardan los registros. */
  protected abstract readonly clave: string;

  /** Nombre legible de la entidad (se usa en mensajes y diálogos). */
  abstract readonly nombreEntidad: string;

  private cache: T[] | null = null;

  /** Los datos se cargan la primera vez que se necesitan (carga perezosa). */
  protected get registros(): T[] {
    if (this.cache === null) {
      this.cache = this.cargar();
    }
    return this.cache;
  }

  // ----------------------------------------------------- métodos polimórficos

  /** Descripción corta de un registro. Cada servicio la implementa a su manera. */
  abstract describir(registro: T): string;

  /** Gancho: reglas de negocio antes de crear un registro (lanza Error si no se cumplen). */
  protected validar(_datos: Omit<T, 'id'>): void {
    // Por defecto no hay reglas adicionales.
  }

  /** Gancho: reglas de negocio antes de eliminar un registro. */
  protected validarEliminacion(_registro: T): void {
    // Por defecto se permite eliminar.
  }

  // ----------------------------------------------------- operaciones comunes

  obtenerTodos(): T[] {
    return this.registros.map(registro => ({ ...registro }));
  }

  buscarPorId(id: number): T | undefined {
    const encontrado = this.registros.find(registro => registro.id === id);
    return encontrado ? { ...encontrado } : undefined;
  }

  contar(): number {
    return this.registros.length;
  }

  /** Crea un registro aplicando primero las validaciones del servicio hijo. */
  protected crear(datos: Omit<T, 'id'>): T {
    this.validar(datos);

    const nuevo = { ...datos, id: this.siguienteId() } as T;
    this.registros.push(nuevo);
    this.guardar();

    return { ...nuevo };
  }

  protected actualizarParcial(id: number, cambios: Partial<Omit<T, 'id'>>): boolean {
    const indice = this.registros.findIndex(registro => registro.id === id);

    if (indice === -1) {
      return false;
    }

    this.registros[indice] = { ...this.registros[indice], ...cambios };
    this.guardar();
    return true;
  }

  eliminar(id: number): boolean {
    const indice = this.registros.findIndex(registro => registro.id === id);

    if (indice === -1) {
      return false;
    }

    this.validarEliminacion(this.registros[indice]);
    this.registros.splice(indice, 1);
    this.guardar();
    return true;
  }

  // ----------------------------------------------------- persistencia (privado)

  private cargar(): T[] {
    try {
      const datos = localStorage.getItem(this.clave);
      if (!datos) return [];

      const resultado: unknown = JSON.parse(datos);
      return Array.isArray(resultado) ? (resultado as T[]) : [];
    } catch {
      return [];
    }
  }

  private guardar(): void {
    localStorage.setItem(this.clave, JSON.stringify(this.registros));
  }

  private siguienteId(): number {
    return this.registros.reduce((mayor, registro) => Math.max(mayor, registro.id), 0) + 1;
  }
}
