import React, {
  useCallback,
  useRef,
  ChangeEvent,
  useMemo,
  useState,
  useEffect,
} from 'react';

import { Link, useHistory, useLocation } from 'react-router-dom';
import { FiArrowLeft, FiLock, FiMail, FiUser, FiCamera } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import { format, parseISO } from 'date-fns';

import * as Yup from 'yup';
import { Container, Content, AvatarInput, Row, ContentForm } from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErrors';

import { useToast } from '../../hooks/toast';
import api from '../../services/api';
import { useAuth } from '../../hooks/auth';

import MyAutocomplete from '../../components/MyAutocomplete';

interface Member {
  id: string;
  name: string;
  date_of_birth: string;
  date_of_birth_formatted: string;
  nationality: string;
  document: string;
  sexy: string;
  marital_status: string;
  spouse_name: string;
  wedding_date: string;
  wedding_date_formatted: string;
  fathers_name: string;
  mothers_name: string;
  email: string;
  telephone: string;
  cell_phone: string;
  postal_code: string;
  address: string;
  address_formatted: string;
  state: string;
  city: string;
  country: string;
  neighborhood: string;
  coming_church: string;
  religious_formation: string;
  baptism_church: string;
  baptism_date: string;
  baptism_date_formatted: string;
  education_level: string;
  course: string;
  profession: string;
}

const SaveMember: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<Member[]>([]);
  const [member, setMember] = useState<Member>({} as Member);

  const location = useLocation();
  const id = location.search.replace('?id=', '');

  const optionsMaritalStatus = useMemo(() => {
    return ['Solteiro', 'Casado', 'Separado', 'Viúvo'];
  }, []);

  const optionsSexy = useMemo(() => {
    return ['F', 'M'];
  }, []);

  const optionsCity = useMemo(() => {
    return members.length > 0 ? members?.map(_member => _member.city) : [];
  }, [members]);

  const optionsAddress = useMemo(() => {
    return members.length > 0 ? members.map(_member => _member.address) : [];
  }, [members]);

  const optionsPostal = useMemo(() => {
    return members.length > 0
      ? members.map(_member => _member.postal_code)
      : [];
  }, [members]);

  const optionsCountry = useMemo(() => {
    return members.length > 0 ? members.map(_member => _member.country) : [];
  }, [members]);

  const optionsState = useMemo(() => {
    return members.length > 0 ? members.map(_member => _member.state) : [];
  }, [members]);

  const optionsNeighborhood = useMemo(() => {
    return members.length > 0
      ? members.map(_member => _member.neighborhood)
      : [];
  }, [members]);

  const optionsNationality = useMemo(() => {
    return members.length > 0
      ? members.map(_member => _member.nationality)
      : [];
  }, [members]);

  const optionsChurch = useMemo(() => {
    return members.length > 0
      ? members.map(_member => _member.coming_church)
      : [];
  }, [members]);

  const optionsFormation = useMemo(() => {
    return members.length > 0
      ? members.map(_member => _member.religious_formation)
      : [];
  }, [members]);

  const optionsEducation = useMemo(() => {
    return members.length > 0
      ? members.map(_member => _member.education_level)
      : [];
  }, [members]);

  const optionsCourse = useMemo(() => {
    return members.length > 0 ? members.map(_member => _member.course) : [];
  }, [members]);

  const optionsProfession = useMemo(() => {
    return members.length > 0 ? members.map(_member => _member.profession) : [];
  }, [members]);

  const optionsWomenName = useMemo(() => {
    return members.length > 0
      ? members
          ?.filter(_member => _member.sexy === 'F' && _member.id !== member.id)
          .map(_member => _member.name)
      : [];
  }, [members, member.id]);

  const optionsSpouseName = useMemo(() => {
    return members.length > 0
      ? members
          ?.filter(_member => _member.sexy !== member.sexy)
          .map(_member => _member.name)
      : [];
  }, [members, member.sexy]);

  const optionsMenName = useMemo(() => {
    return members.length > 0
      ? members
          ?.filter(_member => _member.sexy === 'M' && _member.id !== member.id)
          .map(_member => _member.name)
      : [];
  }, [members, member.id]);

  useEffect(() => {
    async function loadPage(): Promise<void> {
      const response = await api.get<Member[]>('members');
      if (response.data.length > 0) {
        const formMember = response.data.find(
          _member => _member.id.toString() === id,
        );
        if (formMember !== undefined) {
          setMember({
            ...formMember,
            address_formatted: `${formMember.address}, ${formMember.neighborhood}, ${formMember.city}`,
            date_of_birth_formatted: format(
              parseISO(formMember.date_of_birth),
              'dd/MM/Y',
            ),
            baptism_date_formatted: format(
              parseISO(formMember.baptism_date),
              'dd/MM/Y',
            ),
            wedding_date_formatted: format(
              parseISO(formMember.wedding_date),
              'dd/MM/Y',
            ),
          });
        }
        setMembers(response.data);
      }
    }
    loadPage();
  }, []);

  useEffect(() => {
    if (id === '' || (id !== '' && member.id !== undefined)) {
      setLoading(false);
    }
  }, [member, id]);

  const handleSubmitMember = useCallback(
    async (data: Member) => {
      try {
        formRef.current?.setErrors([]);

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
        });

        await schema.validate(data, { abortEarly: false });

        // const response = await api.put('/profiles', data);
        // updateUser(response.data);

        addToast({
          type: 'success',
          title: 'Perfil atualizado com sucesso!',
        });

        history.push('/dashboard');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
          return;
        }

        addToast({
          type: 'error',
          title: 'Erro no cadastro',
          description: 'Houve um erro ao atualizar o perfil, tente novamente.',
        });
      }
    },
    [history, addToast],
  );

  const handleAvatarChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const data = new FormData();
        data.append('avatar', e.target.files[0]);

        api
          .patch('/users/avatar', data)
          .then(response => {
            addToast({
              title: 'Avatar atualizado',
              type: 'success',
            });
            // updateUser(response.data);
          })
          .catch(e => {
            addToast({
              title: 'Houve um erro ao atualizar o avatar',
              type: 'error',
            });
          });
      }
    },
    [addToast, updateUser],
  );

  return (
    <Container>
      <header>
        <div>
          <h1>Editar Membro</h1>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>
      <Content>
        <Form initialData={member} ref={formRef} onSubmit={handleSubmitMember}>
          <AvatarInput>
            <img
              src="https://academyfurniturehire.co.uk/wp-content/uploads/2019/06/user-default-image.png"
              alt={user.name}
            />
            <label htmlFor="avatar">
              <FiCamera />
              <input onChange={handleAvatarChange} type="file" id="avatar" />
            </label>
          </AvatarInput>
          {!loading && (
            <ContentForm>
              <Row>
                <MyAutocomplete name="name" label="Nome" />
                <MyAutocomplete
                  containerStyle={{ width: 100 }}
                  label="Sexo"
                  name="sexy"
                  freeSolo={0}
                  options={optionsSexy}
                />
                <MyAutocomplete
                  containerStyle={{ width: 350 }}
                  label="Data de nasc."
                  name="date_of_birth_formatted"
                />
                <MyAutocomplete
                  containerStyle={{ width: 300 }}
                  label="Nacionalidade"
                  name="nationality"
                  options={optionsNationality}
                />
                <MyAutocomplete
                  containerStyle={{ width: 350 }}
                  label="Documento"
                  name="document"
                />
              </Row>

              <Row>
                <MyAutocomplete
                  name="marital_status"
                  containerStyle={{ width: 250 }}
                  label="Estado civíl"
                  freeSolo={0}
                  options={optionsMaritalStatus}
                />
                <MyAutocomplete
                  name="spouse_name"
                  label="Nome do cônjugue"
                  options={optionsSpouseName}
                />
                <MyAutocomplete
                  name="wedding_date_formatted"
                  containerStyle={{ width: 250 }}
                  label="Data de casamento"
                />
              </Row>

              <Row>
                <MyAutocomplete
                  name="mothers_name"
                  label="Nome da mãe"
                  options={optionsWomenName}
                />
                <MyAutocomplete
                  name="fathers_name"
                  label="Nome do pai"
                  options={optionsMenName}
                />
              </Row>

              <Row>
                <MyAutocomplete name="email" label="E-mail" />
                <MyAutocomplete name="telephone" label="Telefone" />
                <MyAutocomplete name="cell_phone" label="Telemóvel" />
              </Row>

              <Row>
                <MyAutocomplete
                  name="postal_code"
                  containerStyle={{ width: 250 }}
                  label="Código Postal"
                  options={optionsPostal}
                />
                <MyAutocomplete
                  name="address"
                  label="Morada"
                  options={optionsAddress}
                />
              </Row>

              <Row>
                <MyAutocomplete
                  name="neighborhood"
                  label="Freguesia"
                  options={optionsNeighborhood}
                />
                <MyAutocomplete
                  name="city"
                  label="Concelho"
                  options={optionsCity}
                />
                <MyAutocomplete
                  name="state"
                  label="Distrito"
                  options={optionsState}
                />
                <MyAutocomplete
                  name="country"
                  label="País"
                  options={optionsCountry}
                />
              </Row>

              <Row>
                <MyAutocomplete
                  name="coming_church"
                  label="Igreja procedente"
                  options={optionsChurch}
                />
                <MyAutocomplete
                  name="religious_formation"
                  label="Formação religiosa"
                  options={optionsFormation}
                />
                <MyAutocomplete
                  name="baptism_church"
                  label="Igreja de batismo"
                  options={optionsChurch}
                />
                <MyAutocomplete
                  name="baptism_date_formatted"
                  label="Data do batismo"
                />
              </Row>

              <Row>
                <MyAutocomplete
                  name="education_level"
                  label="Formação acadêmica"
                  options={optionsEducation}
                />
                <MyAutocomplete
                  name="course"
                  label="Curso"
                  options={optionsCourse}
                />
                <MyAutocomplete
                  name="profession"
                  label="Profissão"
                  options={optionsProfession}
                />
              </Row>
              <Button type="submit">Confirmar alterações</Button>
            </ContentForm>
          )}
        </Form>
      </Content>
    </Container>
  );
};

export default SaveMember;
